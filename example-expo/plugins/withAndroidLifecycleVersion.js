const { withProjectBuildGradle } = require('expo/config-plugins');

const marker = '// Expo parity example AndroidX Lifecycle compatibility';
const constraint = `
${marker}
allprojects {
    configurations.configureEach {
        resolutionStrategy.eachDependency { details ->
            if (details.requested.group == "androidx.lifecycle" &&
                details.requested.name != "lifecycle-extensions") {
                details.useVersion("2.10.0")
                details.because("Expo SDK 56 uses AGP 8.12 and compileSdk 36")
            }
        }
    }
}
`;

// Mapp Engage 7.1.2 and react-native-video share Media3. Their combined
// dependency graph otherwise selects Lifecycle 2.11, whose metadata requires
// AGP 9.1 and compileSdk 37. Keep this parity-app concern out of the published
// Intelligence plugin and constrain the generated app to Expo SDK 56's range.
module.exports = function withAndroidLifecycleVersion(config) {
  return withProjectBuildGradle(config, (mod) => {
    if (mod.modResults.language !== 'groovy') {
      throw new Error('The Expo parity example requires a Groovy build.gradle');
    }
    if (!mod.modResults.contents.includes(marker)) {
      mod.modResults.contents += constraint;
    }
    return mod;
  });
};
