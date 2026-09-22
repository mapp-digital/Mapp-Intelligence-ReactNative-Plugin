const {
  withGradleProperties,
  withProjectBuildGradle,
} = require('expo/config-plugins');

// The SDK 56 template leaves the Kotlin buildscript dependency versionless.
// Bind it to the app property (optionally set by expo-build-properties), with a
// default compatible with both the native SDK metadata and Expo compiler plugins.
module.exports = function withMappAndroidKotlin(config) {
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
