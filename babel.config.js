const path = require("path");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo",{
        "react-compiler": {
            sources:(filePath) => {
                if(!filePath){
                    return true;
                }
            }
        }
    }],
    plugins: [["react-native-reanimated/plugin"]],
  };
};
