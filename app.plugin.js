const {
  withAppDelegate,
  withGradleProperties,
  withInfoPlist,
  withProjectBuildGradle,
} = require('expo/config-plugins');

function withMappIosScenes(config) {
  // Expo backported its scene runtime in 57.0.23. SDK 58+ enables it in
  // the template; older SDKs must keep their existing application lifecycle.
  const [major, minor, patch] = require('expo/package.json').version
    .split('.')
    .map(Number);
  if (major !== 57 || !Number.isInteger(patch) || (minor === 0 && patch < 23)) {
    return config;
  }

  config = withAppDelegate(config, (mod) => {
    const { language, contents } = mod.modResults;
    const declaration = /class AppDelegate:\s*ExpoAppDelegate\s*\{/;
    const startup = /^[ \t]*window = UIWindow\(frame: UIScreen\.main\.bounds\)\r?\n[ \t]*factory\.startReactNative\(\s*withModuleName: "main",\s*in: window,\s*launchOptions: launchOptions\)\r?\n/m;
    const alreadyMigrated =
      /class AppDelegate:\s*ExpoAppDelegate,\s*ExpoReactNativeFactoryProvider\s*\{/.test(
        contents
      ) &&
      !contents.includes('factory.startReactNative(') &&
      !contents.includes('UIWindow(frame:');

    if (
      language !== 'swift' ||
      (!alreadyMigrated &&
        (!declaration.test(contents) || !startup.test(contents)))
    ) {
      throw new Error(
        'Mapp automatic iOS scene support requires the Expo SDK 57 Swift AppDelegate template. For a custom scene lifecycle, set ios.enableSceneSupport to false in the Mapp plugin options.'
      );
    }
    if (!alreadyMigrated) {
      mod.modResults.contents = contents
        .replace(
          declaration,
          'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {'
        )
        .replace(startup, '')
        .replace(
          /^#if os\(iOS\) \|\| os\(tvOS\)\r?\n[ \t]*#endif\r?\n/m,
          ''
        );
    }
    return mod;
  });

  return withInfoPlist(config, (mod) => {
    const manifest = mod.modResults.UIApplicationSceneManifest;
    if (manifest !== undefined) {
      const scenes =
        manifest?.UISceneConfigurations?.UIWindowSceneSessionRoleApplication;
      if (
        manifest?.UIApplicationSupportsMultipleScenes !== false ||
        scenes?.length !== 1 ||
        scenes[0].UISceneDelegateClassName !== 'EXExpoAppSceneDelegate'
      ) {
        throw new Error(
          'Mapp automatic iOS scene support cannot replace a custom UIApplicationSceneManifest. Set ios.enableSceneSupport to false in the Mapp plugin options to keep the app-owned scene lifecycle.'
        );
      }
      return mod;
    }
    mod.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: 'EXExpoAppSceneDelegate',
          },
        ],
      },
    };
    return mod;
  });
}

// Expo templates leave the Kotlin buildscript dependency versionless.
// Bind it to the app property (optionally set by expo-build-properties), with a
// default compatible with both the native SDK metadata and Expo compiler plugins.
module.exports = function withMappIntelligence(config, options = {}) {
  const appBuildProperties = config.plugins?.find(
    (plugin) => Array.isArray(plugin) && plugin[0] === 'expo-build-properties'
  )?.[1];
  const enableSceneSupport =
    options.ios?.enableSceneSupport ??
    appBuildProperties?.ios?.enableSceneSupport ??
    true;
  if (enableSceneSupport) {
    config = withMappIosScenes(config);
  }
  config = withGradleProperties(config, (mod) => {
    if (
      !mod.modResults.some(
        (item) =>
          item.type === 'property' && item.key === 'android.kotlinVersion'
      )
    ) {
      mod.modResults.push({
        type: 'property',
        key: 'android.kotlinVersion',
        value: '2.3.20',
      });
    }
    return mod;
  });
  return withProjectBuildGradle(config, (mod) => {
    if (mod.modResults.language !== 'groovy') {
      throw new Error(
        'Mapp Expo integration requires a Groovy root build.gradle. Configure the Kotlin plugin version explicitly for other build scripts.'
      );
    }
    mod.modResults.contents = mod.modResults.contents.replace(
      /classpath\((['"])org\.jetbrains\.kotlin:kotlin-gradle-plugin\1\)/g,
      `classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:\${findProperty('android.kotlinVersion')}")`
    );
    return mod;
  });
};
