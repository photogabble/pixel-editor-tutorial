module.exports = function (env, argv) {
    let config = {
        mode: env.production ? 'production' : 'development',
        devtool: env.production ? 'source-maps' : 'eval',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"

                },
            ]
        }
    };

    if (!env.production) {
        config.module.rules.push({
            enforce: "pre",
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "eslint-loader",
        });
    }

    return config;
};