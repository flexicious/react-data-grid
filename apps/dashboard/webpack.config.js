const { merge } = require("webpack-merge");
module.exports = (config, context) => {
    return merge(config, {
        output: {
            publicPath: "/examples/"
        },
        module: {
            rules: [
                {
                    test: /\.md$/,
                    use: [
                        {
                            loader: "react-code-view/webpack-md-loader",
                            options: {
                                parseLanguages: ["typescript", "rust"],
                            },
                        },
                    ],
                },
            ],
        },
    });
};








