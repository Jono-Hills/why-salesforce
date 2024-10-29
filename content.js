const storageKey = 'sfmWhySF';
const setupDomains = /(lightning\.force\.com\/setup|\.salesforce-setup\.com)/
let tabRows = [];
let menuRows = [];


function initData() {
    const dividerHtml = `<li role="separator" class="slds-has-divider_top-space" data-aura-rendered-by="6165:0"></li>`;
    menuRows.push(dividerHtml);
    browser.storage.sync.get([storageKey], function(items) {
        let tabData = items[storageKey];

        if (!tabData) { //Did not find data inside browser storage
            tabData = defaultTabs();
        }

        for (const rowId in tabData) {
            let row = tabData[rowId];
            tabRows.push(generateRowTemplate(row.tabTitle, row.url));
            menuRows.push(generateMenuTemplate(row.tabTitle, row.url));
        }
    });
}

function initCogMenu(setupCogUl){
    if (setupCogUl){
        setupCogUl.insertAdjacentHTML('beforeend', menuRows.join(''));
    }
}

function initTabs(setupTabUl){
    if (setupTabUl){
        setupTabUl.insertAdjacentHTML('beforeend', tabRows.join(''));
    }
}


function delayLoadSetupCog(count) {
    // Ugly selector... not much to work with => <div role="menu" data-aura-rendered-by="175:209;a">
    const setupCogUl =  document.querySelectorAll('.uiMenuList div[role="menu"]:not(.overflowList, .globalCreateMenuList)')[0];
    count++;

    if (count > 5){
        console.log('Why Salesforce - failed to find setup cog.');
        return;
    }

    if (!setupCogUl) {
        setTimeout(function() { delayLoadSetupCog(0); }, 3000);
    } else {
        initCogMenu(setupCogUl);
    }
}

function delayLoadSetupTabs(count) {
    const setupTabUl  = document.getElementsByClassName("tabBarItems slds-grid")[0];
    count++;

    if (count > 5){
        console.log('Why Salesforce - failed to find setup tab.');
        return;
    }

    if (!setupTabUl) {
        setTimeout(function() { delayLoadSetupTabs(0); }, 3000);
    } else {
        initTabs(setupTabUl);
    }
}

initData();
setTimeout(function() { delayLoadSetupCog(0); }, 3000);
// Only load tabs if in setup page
const currentUrl = window.location.href;
console.log('currentURL', currentUrl);
if (setupDomains.test(currentUrl)) {
    setTimeout(function() { delayLoadSetupTabs(0); }, 3000);
} 


function generateRowTemplate(tabTitle, url){
    return `<li role="presentation" style="" class="oneConsoleTabItem tabItem slds-context-bar__item borderRight  navexConsoleTabItem" data-aura-class="navexConsoleTabItem">
                <a role="tab" tabindex="-1" title="${tabTitle}" aria-selected="false" href="${url}" class="tabHeader slds-context-bar__label-action " >
                    <span class="title slds-truncate" >${tabTitle}</span>
                </a>
            </li>`
}

function generateMenuTemplate(tabTitle, url){
    return `<li role="presentation" class="slds-dropdown__item uiMenuItem onesetupSetupMenuItem" data-aura-class="uiMenuItem onesetupSetupMenuItem">
                <a role="menuitem" data-id="sales_setup_home" href="${url}" title="${tabTitle}">
                    <div class="slds-grid" >
                        <div class="slds-col slds-size_10-of-12" >
                            <span class="slds-truncate">
                                <span class="left-icon setup-icon slds-icon_container slds-m-right_small sales-setup-home-icon">
                                    <lightning-icon></lightning-icon>
                                </span>
                                <span class="slds-align-middle">
                                    ${tabTitle}
                                </span>
                            </span>
                        </div>
                    </div>
                </a>
            </li>`
}

function defaultTabs(){
    let tabs = [
        {tabTitle : 'Flow', url: '/lightning/setup/Flows/home'},
        {tabTitle : 'User', url: '/lightning/setup/ManageUsers/home'}
    ]

    browser.storage.sync.set({storageKey: tabs}, function() {
        //TODO combine with popup.js with background service
    });

    return tabs;
}