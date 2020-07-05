module.exports = {
    base: '/blog/',
    title: 'Dyang Blog',
    description: 'Personal blog',
    plugins: [
        // '@vuepress/active-header-links',
        // '@vuepress/back-to-top',
        // '@vuepress/nprogress',
    ],
    theme: 'reco',
    themeConfig: {
        type: 'blog',
        author: 'Dyang',
        authorAvatar: '/bl.jpg',
        nav: [
            {
                text: 'TimeLine',
                link: '/timeline/',
                icon: 'reco-date'
            }
        ],
        blogConfig: {
            category: {
                location: 2,
                text: 'Category'
            },
            tag: {
                location: 3,
                text: 'Tag'
            }
        },
        sidebar: 'auto',
    }
}