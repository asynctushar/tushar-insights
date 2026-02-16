export default ({ env }) => ({
    upload: {
        config: {
            provider: 'cloudinary',
            providerOptions: {
                cloud_name: env('CLOUDINARY_NAME'),
                api_key: env('CLOUDINARY_KEY'),
                api_secret: env('CLOUDINARY_SECRET'),
            },
            actionOptions: {
                upload: {
                    folder: 'tushar-insights',
                    resource_type: 'auto',
                },
                uploadStream: {
                    folder: 'tushar-insights',
                    resource_type: 'auto',
                },
            },
        },
    },
});
