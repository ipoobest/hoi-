module.exports = {
  devServer: {
    disableHostCheck: true
  },
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    i18n: {
      locale: "th",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  },
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        prependData: `$customerno: ${process.env.VUE_APP_CUSTOMER_NO};`
      }
    },
    requireModuleExtension: true,
    extract: false
  },
  pwa: {
    name: process.env.VUE_APP_FULLNAME,
    shortName: process.env.VUE_APP_NAME,
    msTileColor: "#000000",
    backgroundColor: "#2F2F2F",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      theme_color: "#000000",
      icons: [
        {
          src: `./img/icons/${process.env.VUE_APP_CUSTOMER_NO}/android-chrome-192x192.png`,
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: `./img/icons/${process.env.VUE_APP_CUSTOMER_NO}/android-chrome-512x512.png`,
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: `./img/icons/${process.env.VUE_APP_CUSTOMER_NO}/android-chrome-192x192.png`,
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: `./img/icons/${process.env.VUE_APP_CUSTOMER_NO}/android-chrome-512x512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ],
      start_url: ".",
      display: "standalone",
      background_color: "#2F2F2F"
    },
    iconPaths: {
      favicon32: `img/icons/${process.env.VUE_APP_CUSTOMER_NO}/favicon-32x32.png`,
      favicon16: `img/icons/${process.env.VUE_APP_CUSTOMER_NO}/favicon-16x16.png`,
      appleTouchIcon: `img/icons/${process.env.VUE_APP_CUSTOMER_NO}/apple-touch-icon-152x152.png`,
      maskIcon: `img/icons/${process.env.VUE_APP_CUSTOMER_NO}/safari-pinned-tab.svg`,
      msTileImage: `img/icons/${process.env.VUE_APP_CUSTOMER_NO}/msapplication-icon-144x144.png`
    }
  }
};
