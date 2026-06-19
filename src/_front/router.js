import { createRouter, createWebHistory } from 'vue-router';

import wwPage from './views/wwPage.vue';

import {
    initializeData,
    initializePlugins,
    initializeIntegrationInstances,
    onPageUnload,
} from '@/_common/helpers/data';
import { convertPathToRouterFormat } from '@/_common/helpers/urlParametersParsing';
import { getRuntimeEnvironment } from '@/helpers/frontEnv.js';
import { useBackAuthStore } from '@/pinia/backAuth.js';

/**
 * @typedef {import('vue-router').Router} Router
 * @typedef {import('vue-router').RouteRecordRaw} RouteRecordRaw
 * @typedef {import('vue-router').RouterOptions} RouterOptions
 * @typedef {import('vue-router').RouterScrollBehavior} RouterScrollBehavior
 */

/**
 * @typedef {Object} Lang
 * @property {string} lang
 * @property {boolean} [default]
 * @property {boolean} [isDefaultPath]
 */

/**
 * @typedef {Object} PageSecurity
 * @property {'authenticated' | string} [accessRule]
 * @property {string[]} [accessRoles]
 * @property {'AND' | 'OR'} [accessRolesCondition]
 */

/**
 * @typedef {Object} Page
 * @property {string} id
 * @property {Record<string, string> & { default: string }} paths
 * @property {string[]} langs
 * @property {PageSecurity} [security]
 * @property {{ userGroup: string }[]} [pageUserGroups]
 */

/**
 * @typedef {Object} DesignInfo
 * @property {string} homePageId
 * @property {Page[]} pages
 * @property {Lang[]} langs
 * @property {unknown} [auth]
 * @property {{ href?: string }} [baseTag]
 */

/** @type {Router} */
let router;
/** @type {RouteRecordRaw[]} */
const routes = [];

/** @type {RouterScrollBehavior} */
const scrollBehavior = to => {
    if (to.hash) {
        return {
            el: to.hash,
            behavior: 'smooth',
        };
    } else {
        return { top: 0 };
    }
};

 
/* wwFront:start */
import pluginsSettings from '../../plugins-settings.json';

window.wwg_designInfo = {"id":"dd2d6536-2a00-4483-8ce9-001cc8448e6e","homePageId":"6d982940-863b-4b07-b6eb-21a49cade803","authPluginId":null,"baseTag":null,"defaultTheme":"light","langs":[{"lang":"en","default":true}],"background":{},"workflows":[],"back":{"isServerSetup":{"staging":true,"production":true}},"auth":null,"pages":[{"id":"5bcd087c-e13e-4a6a-9624-0642545ff831","linkId":"5bcd087c-e13e-4a6a-9624-0642545ff831","name":"Admin","folder":null,"paths":{"en":"admin","default":"admin"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"f11466cf-d13c-4296-8bd0-dab00c435c82","sectionTitle":"Section","linkId":"2bebc170-a7cb-4db3-8f7c-75384bbde4ca"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"9449b5f7-dc16-4afd-967c-495d403d679d","linkId":"9449b5f7-dc16-4afd-967c-495d403d679d","name":"Process","folder":null,"paths":{"en":"process","default":"process"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"84291119-244f-43dc-9300-3c29d2841459","sectionTitle":"Section","linkId":"f27eb4c5-d311-4330-8449-580b1d81970e"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"4b571c88-caf0-46d6-aba8-a430a4020f9e","linkId":"4b571c88-caf0-46d6-aba8-a430a4020f9e","name":"Start a Project","folder":null,"paths":{"en":"start-a-project","default":"start-a-project"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"bc587f81-96ca-42dc-b2c8-3ca8d7cd2269","sectionTitle":"Section","linkId":"34b847af-1b04-42fa-9d07-de2bf3364d9b"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"18a54226-1d91-4292-8412-4187561047ec","linkId":"18a54226-1d91-4292-8412-4187561047ec","name":"What I Build","folder":null,"paths":{"en":"what-i-build","default":"what-i-build"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"f2992d07-9d47-4618-bb1c-4ee147db094a","sectionTitle":"Section","linkId":"736a3c11-0208-4ec7-bbeb-64c486d8741f"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"343ac7d4-1de1-4781-a7d2-81a85639393f","linkId":"343ac7d4-1de1-4781-a7d2-81a85639393f","name":"Work","folder":null,"paths":{"en":"work","default":"work"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"cdd8bfd3-d63d-459c-8ec5-2c7b0e190bee","sectionTitle":"Section","linkId":"600d99d7-ce2a-4bd6-bf4b-850dc4168d5f"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"6d982940-863b-4b07-b6eb-21a49cade803","linkId":"6d982940-863b-4b07-b6eb-21a49cade803","name":"Home","folder":null,"paths":{"en":"home","default":"home"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"e31eeb85-1a50-49d6-94bf-7e444452ae0f","sectionTitle":"Section","linkId":"3f3e8a1a-b59f-4318-8c72-04bb95a3de41"}],"pageUserGroups":[],"title":{"en":"Maggie Dukek | Websites, Apps & Custom Systems","fr":"Vide | Commencer à partir de zéro"},"meta":{"desc":{"en":"Maggie Dukek builds custom websites, apps, dashboards, and digital systems that turn scattered, half-built ideas into tools that actually work."},"keywords":{"en":"websites, custom apps, dashboards, digital systems, small business websites, app builds, full stack build, workflow systems, Maggie Dukek"},"socialDesc":{"en":"Maggie Dukek builds custom websites, apps, dashboards, and digital systems that turn scattered, half-built ideas into tools that actually work."},"socialTitle":{"en":"Maggie Dukek | Websites, Apps & Custom Systems"},"structuredData":{"en":"{\r\n  \"@context\": \"https://schema.org\",\r\n  \"@type\": \"Person\",\r\n  \"name\": \"Maggie Dukek\",\r\n  \"url\": \"https://maggiedukek.com\",\r\n  \"jobTitle\": \"Website, App, and Custom Systems Builder\",\r\n  \"description\": \"Maggie Dukek builds custom websites, apps, dashboards, and digital systems that turn scattered, half-built ideas into tools that actually work.\",\r\n  \"sameAs\": [\r\n    \"https://maggiedukek.com\"\r\n  ],\r\n  \"knowsAbout\": [\r\n    \"Custom websites\",\r\n    \"Custom apps\",\r\n    \"Dashboards\",\r\n    \"Digital systems\",\r\n    \"Workflow systems\",\r\n    \"Full-stack builds\",\r\n    \"Small business websites\"\r\n  ]\r\n}"}},"metaImage":"images/Untitled__1400_x_250_px___Logo_.png?_wwcv=47","security":{}}],"plugins":[]};
window.wwg_cacheVersion = 47;
window.wwg_pluginsSettings = pluginsSettings;
window.wwg_disableManifest = true;

/** @type {Lang} */
const defaultLang = window.wwg_designInfo.langs.find(({ default: isDefault }) => isDefault) || {
    lang: 'en',
    default: true,
};

/**
 * @param {Page} page
 * @param {Lang} lang
 * @param {string} [forcedPath]
 */
const registerRoute = (page, lang, forcedPath) => {
    const langSlug = !lang.default || lang.isDefaultPath ? `/${lang.lang}` : '';
    let path =
        forcedPath ||
        (page.id === window.wwg_designInfo.homePageId ? '/' : `/${page.paths[lang.lang] || page.paths.default}`);

    path = convertPathToRouterFormat(path);

    routes.push({
        path: langSlug + path,
        component: wwPage,
        name: `page-${page.id}-${lang.lang}`,
        meta: {
            pageId: page.id,
            lang,
            isPrivate: !!page.pageUserGroups?.length,
        },
        async beforeEnter(to, from) {
            if (to.name === from.name) return;
            //Set page lang
            wwLib.wwLang.defaultLang = defaultLang.lang;
            wwLib.$store.dispatch('front/setLang', lang.lang);

            const backAuthStore = useBackAuthStore(wwLib.$pinia);
            if (!wwLib.wwAuth.plugin) {
                if (!backAuthStore.projectAuth && window.wwg_designInfo.auth) {
                    backAuthStore.setProjectAuth(window.wwg_designInfo.auth);
                }
            }

            //Init plugins
            await initializePlugins();

            //Init integration instances
            await initializeIntegrationInstances();

            if (!wwLib.wwAuth.plugin) {
                await backAuthStore.refresh();
                const projectAuth = backAuthStore.projectAuth || {};

                //Check if private page
                if (page.security?.accessRule === 'authenticated') {
                    if (!backAuthStore.isAuthenticated) {
                        window.location.href = `${wwLib.wwPageHelper.getPagePath(
                            projectAuth.unauthenticatedPageId
                        )}?_source=${to.path}`;
                        return null;
                    } else if (page.security?.accessRoles?.length) {
                        const hasAccess =
                            page.security.accessRolesCondition === 'AND'
                                ? backAuthStore.matchAllRoles(page.security.accessRoles)
                                : backAuthStore.matchAnyRoles(page.security.accessRoles);
                        if (!hasAccess) {
                            window.location.href = `${wwLib.wwPageHelper.getPagePath(
                                projectAuth.unauthorizedPageId
                            )}?_source=${to.path}`;
                            return null;
                        }
                    }
                }
            } else {
                // Deprecated legacy auth plugins, to remove in the future
                if (page.pageUserGroups?.length) {
                    await wwLib.wwAuth.init();

                    // Redirect to not sign in page if not logged
                    if (!wwLib.wwAuth.getIsAuthenticated()) {
                        window.location.href = `${wwLib.wwPageHelper.getPagePath(
                            wwLib.wwAuth.getUnauthenticatedPageId()
                        )}?_source=${to.path}`;

                        return null;
                    }

                    //Check roles are required
                    if (
                        page.pageUserGroups.length > 1 &&
                        !wwLib.wwAuth.matchUserGroups(page.pageUserGroups.map(({ userGroup }) => userGroup))
                    ) {
                        window.location.href = `${wwLib.wwPageHelper.getPagePath(
                            wwLib.wwAuth.getUnauthorizedPageId()
                        )}?_source=${to.path}`;

                        return null;
                    }
                }
            }

            try {
                await import(`@/pages/${page.id.split('_')[0]}.js`);
                await wwLib.wwWebsiteData.fetchPage(page.id);

                //Scroll to section or on top after page change
                if (to.hash) {
                    const targetElement = document.getElementById(to.hash.replace('#', ''));
                    if (targetElement) targetElement.scrollIntoView();
                } else {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }

                return;
            } catch (err) {
                wwLib.$store.dispatch('front/showPageLoadProgress', false);

                if (err.redirectUrl) {
                    return { path: err.redirectUrl || '404' };
                } else {
                    //Any other error: go to target page using window.location
                    window.location = to.fullPath;
                }
            }
        },
    });
};

for (const page of window.wwg_designInfo.pages) {
    for (const lang of window.wwg_designInfo.langs) {
        if (!page.langs.includes(lang.lang)) continue;
        registerRoute(page, lang);
    }
}

const page404 = window.wwg_designInfo.pages.find(page => page.paths.default === '404');
if (page404) {
    for (const lang of window.wwg_designInfo.langs) {
        // Create routes /:lang/:pathMatch(.*)* etc for all langs of the 404 page
        if (!page404.langs.includes(lang.lang)) continue;
        registerRoute(
            page404,
            {
                default: false,
                lang: lang.lang,
            },
            '/:pathMatch(.*)*'
        );
    }
    // Create route /:pathMatch(.*)* using default project lang
    registerRoute(page404, { default: true, isDefaultPath: false, lang: defaultLang.lang }, '/:pathMatch(.*)*');
} else {
    routes.push({
        path: '/:pathMatch(.*)*',
        redirect: null,
        async beforeEnter() {
            window.location.href = '/404';
        },
    });
}

/** @type {RouterOptions} */
let routerOptions;

const isProd = getRuntimeEnvironment() === 'production';

if (isProd && window.wwg_designInfo.baseTag?.href) {
    let baseTag = window.wwg_designInfo.baseTag.href;
    if (!baseTag.startsWith('/')) {
        baseTag = '/' + baseTag;
    }
    if (!baseTag.endsWith('/')) {
        baseTag += '/';
    }

    routerOptions = {
        history: createWebHistory(baseTag),
        routes,
    };
} else {
    routerOptions = {
        history: createWebHistory(),
        routes,
    };
}

router = createRouter({
    ...routerOptions,
    scrollBehavior,
});

//Trigger on page unload
let isFirstNavigation = true;
router.beforeEach(async (to, from) => {
    if (to.name === from.name) return;
    if (!isFirstNavigation) await onPageUnload();
    isFirstNavigation = false;
    wwLib.globalVariables._navigationId++;
    return;
});

//Init page
router.afterEach((to, from, failure) => {
    wwLib.$store.dispatch('front/showPageLoadProgress', false);
    let fromPath = from.path;
    let toPath = to.path;
    if (!fromPath.endsWith('/')) fromPath = fromPath + '/';
    if (!toPath.endsWith('/')) toPath = toPath + '/';
    if (failure || (from.name && toPath === fromPath)) return;
    initializeData(to);
});
/* wwFront:end */

export default router;
