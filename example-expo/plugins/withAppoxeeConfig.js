const fs = require('node:fs');
const path = require('node:path');
const { IOSConfig, withXcodeProject } = require('expo/config-plugins');

// The parity example also exercises react-native-mapp-plugin. That SDK expects
// AppoxeeConfig.plist as an iOS target resource; this app-owned plugin keeps the
// generated Xcode project reproducible without changing the Intelligence
// package's native contract.
module.exports = function withAppoxeeConfig(config) {
  return withXcodeProject(config, (mod) => {
    const projectRoot = mod.modRequest.projectRoot;
    const projectName = IOSConfig.XcodeUtils.getProjectName(projectRoot);
    const relativePath = `${projectName}/AppoxeeConfig.plist`;
    const source = path.join(projectRoot, 'AppoxeeConfig.plist');
    const destination = path.join(
      IOSConfig.Paths.getSourceRoot(projectRoot),
      'AppoxeeConfig.plist'
    );

    fs.copyFileSync(source, destination);
    if (!mod.modResults.hasFile(relativePath)) {
      mod.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: relativePath,
        groupName: projectName,
        project: mod.modResults,
        isBuildFile: true,
      });
    }
    return mod;
  });
};
