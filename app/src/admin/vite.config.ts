import { mergeConfig, type UserConfig } from "vite";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    plugins: [monacoEditorPlugin({})],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  });
};
