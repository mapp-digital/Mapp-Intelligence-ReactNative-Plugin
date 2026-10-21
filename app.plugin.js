const { withProjectBuildGradle } = require('expo/config-plugins');

// Expo's versionless classpath can resolve a different compiler from the app's
// android.kotlinVersion property. Honor that property without supplying a version;
// when it is absent, retain the framework's versionless dependency selection.
module.exports = function withMappIntelligence(config) {
  return withProjectBuildGradle(config, (mod) => {
    if (mod.modResults.language !== 'groovy') {
      throw new Error(
        'Mapp Expo integration requires a Groovy root build.gradle. Configure the Kotlin plugin version explicitly for other build scripts.'
      );
    }
    mod.modResults.contents = mod.modResults.contents.replace(
      /classpath\((['"])org\.jetbrains\.kotlin:kotlin-gradle-plugin\1\)/g,
      `classpath("org.jetbrains.kotlin:kotlin-gradle-plugin" + (findProperty('android.kotlinVersion') ? ":\${findProperty('android.kotlinVersion')}" : ""))`
    );
    return mod;
  });
};
