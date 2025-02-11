import { test, expect } from '@playwright/test';
import { table } from 'console';
import { transferableAbortSignal } from 'util';


test('Verify the url and the log', async ({ page }) => {
    await page.goto('https://www.cricketworldcup.com/');
    expect(page.url()).toContain('cricket');
    //const iCCLogo =  page.locator('//img[@alt="Header Logo"]');
    //can use : await expect(page.locator('//img[@alt="Header Logo"]')).toBeVisible; 
    await expect(page.locator('//img[@alt="Header Logo"]')).toBeVisible();
});

//Part 2: Assertions and Locators
test('Search and Verify new URL and heading', async ({ page }) => {
    //Flow:
    // Search for a CountQueuingStrategy, example 'India',
    // Assert page url contains - search?q=India,
    // //Assert text contains - Results for India
    await page.goto('https://www.cricketworldcup.com/');
    await page.getByText('Search').click(); //alternative: await page.getByRole('button',{name: 'Search}).click();
    //page.locator('//span[contains(text(), "Search")]').click();//First attempt
    await page.getByPlaceholder('what are you looking for?').click();
    /*alt: const searchInput =  page.getByPlaceholder('what are you looking for?');
    await searchInput.fill('India); */
    await page.getByPlaceholder('what are you looking for?').fill('India');
    await page.keyboard.press('Enter'); //Press enter key
    await page.waitForTimeout(2000); //*alt: await page.pause();
    expect(page.url()).toContain('search?q=India');


});

//Part 3: Handling Multiple Elements - Key: Iterating Over multiple elements

test('Verify Menu Tabs text & Links', async ({ page }) => {
    // Flow:
    // Assert the text of all the menu tabs 
    // Assert the text and the link for each menu tabs 
    await page.goto('https://www.cricketworldcup.com/');

    //Create an array
    const menuTabs = [
        "ICC HOME",
        'MATCHES',
        'STANDINGS',
        'VENUES',
        'NEWS',
        'TEAMS',
        'VIDEOS',
        'STATS',
        'MORE'

    ]
    const listItems = page.locator('.grow .group');
    // for const listItems of listItems {

    // }
    console.log(await listItems.allInnerTexts());
    console.log("Logged");
    expect(await listItems.allInnerTexts()).toEqual(menuTabs);

    const expectedTabTextLinks = [
        {
            text: 'ICC Home',
            href: '/index'
        },
        {
            text: 'Matches',
            href: '/tournaments/cricketworldcup/matches'
        },
        {
            text: 'Standings',
            href: '/tournaments/cricketworldcup/standings'
        },
        {
            text: 'Venues',
            href: '/tournaments/cricketworldcup/venues'
        },
        {
            text: 'News',
            href: '/tournaments/cricketworldcup/news'
        },
        {
            text: 'Teams',
            href: '/tournaments/cricketworldcup/teams'
        },
        {
            text: 'Videos',
            href: '/tournaments/cricketworldcup/videos'
        },
        {
            text: 'Stats',
            href: '/tournaments/cricketworldcup/stats/'
        }
        // {
        //     text: 'More',
        //     href: '#nolink'
        // }

    ]
    //Loop to match item with url
    for (const [index, listItem] of expectedTabTextLinks.entries()) {
        const link = listItems.nth(index).locator(' a');
        await expect(link).toHaveText(listItem.text);
        await expect(link).toHaveAttribute('href', listItem.href);
    }



});

//Part 4: Interacting with Tables and Rows - Working with Index and Css Property

test.only('Verify number of rows and css prop of element', async ({ page }) => {

    // Flow:
    // Assert the total number of rows in the table
    // Assert the css property of the elements

    await page.goto('https://www.icc-cricket.com/tournaments/cricketworldcup/standings');
    // const numberRows = await page.locator('tbody tr').count();
    await expect(page.locator('tbody tr')).toHaveCount(10);
    const totalRows = page.locator('tbody tr');

    //Verify 4th row has border class --// using nth to grab and check  4th row
    await expect(totalRows.nth(3)).toHaveClass(/.*border-dotted.*/); //regex to  anything before and after works with table-body etc

    //Verify Css Property
    await expect(page.locator('.border-dotted')).toHaveCSS('border-style', 'dotted');




});
//Part 5: Handling New Tab & Page -- Working with tabs &Page management

test('Verify', async ({ page }) => {


// Flow:
// Open New tab 
// Assert the title of the New Tab
//go back to original page
//on cricketworldcup.com, only the social media links open in a new tab, so i will use that.

await page.goto('/');
//click on link and wait for the new tab to get triggered
const youtubeButton = page.locator('//a[@href="https://www.youtube.com/@ICC" and @class="social-icon"]');
const [newPage] = await Promise.all([ //returns a page then new page popup
    await page.waitForEvent('popup'),
    //await youtubeButton.nth(1).click()
    page.locator('//a[@href="https://www.youtube.com/@ICC" and @class="social-icon"]').scrollIntoViewIfNeeded(),
    page.locator('//a[@href="https://www.youtube.com/@ICC" and @class="social-icon"]').nth(1).click()
//*TODO: Figure out the locator.

])

//wait for new page to load
await newPage.waitForLoadState();

//const newTabOpen = page.waitForEvent('popup');

//Assertion
await expect(newPage).toHaveTitle('ICC - YouTube');

//Close the new tab
await newPage.close();







});