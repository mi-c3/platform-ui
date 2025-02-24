module.exports = [
    // File Loader Configuration (fileloader.middleware.js)
    {
        test: /\.(mp3|gltf|glb)$/,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]',
                outputPath: 'assets/',
            },
        },
    },
    {
        test: /\.(jpg|jpeg|png|gif|svg|webp)$/,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]',
                outputPath: 'assets/images/',
            },
        },
    },
];
