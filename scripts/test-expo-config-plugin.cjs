const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

// Run the plugin's real callbacks against native fixtures without requiring Expo
// in the CLI workspace. Real Expo mod execution is covered by test:prebuild.
function applyPlugin(
  properties,
  contents,
  {
    expoVersion = '56.0.0',
    appDelegate = iosTemplate,
    language = 'swift',
    infoPlist = {},
    options = {},
    plugins = [],
  } = {}
) {
  const sandbox = {
    module: { exports: {} },
    require(name) {
      if (name === 'expo/package.json') return { version: expoVersion };
      assert.equal(name, 'expo/config-plugins');
      return {
        withAppDelegate(config, action) {
          config.appDelegate = action({
            modResults: { language, contents: appDelegate },
          }).modResults.contents;
          return config;
        },
        withInfoPlist(config, action) {
          config.infoPlist = action({ modResults: infoPlist }).modResults;
          return config;
        },
        withGradleProperties(config, action) {
          config.properties = action({ modResults: properties }).modResults;
          return config;
        },
        withProjectBuildGradle(config, action) {
          config.gradle = action({
            modResults: { language: 'groovy', contents },
          }).modResults.contents;
          return config;
        },
      };
    },
  };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, '../app.plugin.js'), 'utf8'),
    sandbox
  );
  return sandbox.module.exports({ plugins }, options);
}

const template =
  "dependencies { classpath('org.jetbrains.kotlin:kotlin-gradle-plugin') }";

const iosTemplate = `import Expo
class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?
  var reactNativeFactory: RCTReactNativeFactory?
  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let factory = ExpoReactNativeFactory(delegate: ReactNativeDelegate())
    reactNativeFactory = factory
#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
`;

test('supplies a compatible Expo compiler default and binds the classpath to the property', () => {
  const result = applyPlugin([], template);
  assert.equal(result.properties.length, 1);
  assert.equal(result.properties[0].key, 'android.kotlinVersion');
  assert.equal(result.properties[0].value, '2.3.20');
  assert.ok(result.gradle.includes("${findProperty('android.kotlinVersion')}"));
  assert.ok(!result.gradle.includes('2.3.20'));
});

test('preserves the consuming app Kotlin setting and unrelated properties', () => {
  const properties = [
    { type: 'property', key: 'android.kotlinVersion', value: '2.3.10' },
    { type: 'property', key: 'android.compileSdkVersion', value: '36' },
  ];
  const before = JSON.stringify(properties);
  const result = applyPlugin(properties, template);
  assert.equal(JSON.stringify(result.properties), before);
});

test('reapplying mods does not duplicate properties or modify the Gradle dependency again', () => {
  const first = applyPlugin([], template);
  const second = applyPlugin(first.properties, first.gradle);
  assert.equal(JSON.stringify(second), JSON.stringify(first));
});

test('preserves an explicitly versioned Kotlin dependency', () => {
  const contents =
    'classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:2.3.10")';
  assert.equal(applyPlugin([], contents).gradle, contents);
});

test('migrates the SDK 57 app to the built-in Expo scene delegate', () => {
  const result = applyPlugin([], template, {
    expoVersion: '57.0.23',
    infoPlist: { CFBundleDisplayName: 'Keep app settings' },
  });
  assert.match(
    result.appDelegate,
    /AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider/
  );
  assert.ok(result.appDelegate.includes('reactNativeFactory = factory'));
  assert.ok(result.appDelegate.includes('return super.application('));
  assert.doesNotMatch(
    result.appDelegate,
    /UIWindow\(frame:|factory\.startReactNative\(|#if|#endif/
  );
  assert.equal(result.infoPlist.CFBundleDisplayName, 'Keep app settings');
  const manifest = result.infoPlist.UIApplicationSceneManifest;
  assert.equal(manifest.UIApplicationSupportsMultipleScenes, false);
  const scenes = manifest.UISceneConfigurations.UIWindowSceneSessionRoleApplication;
  assert.equal(scenes.length, 1);
  assert.equal(scenes[0].UISceneDelegateClassName, 'EXExpoAppSceneDelegate');
});

test('reapplying scene support preserves already migrated files', () => {
  const first = applyPlugin([], template, { expoVersion: '57.0.30' });
  const second = applyPlugin(first.properties, first.gradle, {
    expoVersion: '57.0.30',
    appDelegate: first.appDelegate,
    infoPlist: first.infoPlist,
  });
  assert.equal(JSON.stringify(second), JSON.stringify(first));
});

test('preserves lifecycle files on SDKs without the backport or with native scene templates', () => {
  for (const expoVersion of ['56.0.0', '57.0.22', '57.0.23-canary.1', '58.0.0']) {
    const result = applyPlugin([], template, { expoVersion });
    assert.equal(result.appDelegate, undefined, expoVersion);
    assert.equal(result.infoPlist, undefined, expoVersion);
    assert.equal(result.properties[0].value, '2.3.20');
  }
});

test('supports app-owned scene lifecycle through the Mapp plugin opt-out', () => {
  const result = applyPlugin([], template, {
    expoVersion: '57.0.30',
    appDelegate: 'custom app delegate',
    options: { ios: { enableSceneSupport: false } },
  });
  assert.equal(result.appDelegate, undefined);
  assert.equal(result.infoPlist, undefined);
  assert.equal(result.properties[0].value, '2.3.20');
});

test('respects the existing expo-build-properties scene opt-out', () => {
  const result = applyPlugin([], template, {
    expoVersion: '57.0.30',
    plugins: [['expo-build-properties', { ios: { enableSceneSupport: false } }]],
  });
  assert.equal(result.appDelegate, undefined);
  assert.equal(result.infoPlist, undefined);
});

test('rejects custom AppDelegates instead of partially rewriting their startup', () => {
  for (const input of [
    { language: 'objc' },
    {
      appDelegate: iosTemplate.replace(
        'withModuleName: "main"',
        'withModuleName: "custom"'
      ),
    },
  ]) {
    assert.throws(
      () => applyPlugin([], template, { expoVersion: '57.0.30', ...input }),
      /requires the Expo SDK 57 Swift AppDelegate template/
    );
  }
});

test('preserves custom scene manifests by reporting a configuration conflict', () => {
  const manifest = { UIApplicationSupportsMultipleScenes: true };
  const before = JSON.stringify(manifest);
  assert.throws(
    () =>
      applyPlugin([], template, {
        expoVersion: '57.0.30',
        infoPlist: { UIApplicationSceneManifest: manifest },
      }),
    /cannot replace a custom UIApplicationSceneManifest/
  );
  assert.equal(JSON.stringify(manifest), before);
});
