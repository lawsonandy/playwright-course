import { test } from "@playwright/test"
import { MyAccountPage } from "./../page-objects/MyAccountPage.js"
import { getLoginToken } from "./../api-calls/getLoginToken.js"
import { adminDetails } from "./../data/userDetails.js"

test.only("My Account using cookie injection", async ({ page }) => {
  const loginToken = await getLoginToken(adminDetails.username, adminDetails.password)
  const myAccount = new MyAccountPage(page)
  await myAccount.visit()
  await page.evaluate(([loginTokenInsideBrowserCode]) => {
    document.cookie = "token=" + loginTokenInsideBrowserCode
  }, [loginToken])
  await myAccount.visit()
  await myAccount.waitForPageHeading()
})
