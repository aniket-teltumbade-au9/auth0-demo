```JS-POST-Login for connected accounts

/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
    const primarySub = event.request.query?.linking_primary_sub;

    if (!primarySub) return;
    if (primarySub === event.user.user_id) return;

    const { ManagementClient } = require("auth0");
    const management = new ManagementClient({
        domain: event.secrets.DOMAIN,
        clientId: event.secrets.CLIENT_ID,
        clientSecret: event.secrets.CLIENT_SECRET,
    });

    // user_id format is "provider|id" — split only on first pipe
    const firstPipe = event.user.user_id.indexOf("|");
    const provider = event.user.user_id.slice(0, firstPipe);
    const userId = event.user.user_id.slice(firstPipe + 1);

    try {
        await management.users.identities.link(primarySub, {
            provider,
            user_id: userId
        });
        console.log(`Linked ${event.user.user_id} → ${primarySub}`);

        // Signal to the callback that linking completed successfully
        api.idToken.setCustomClaim("linking_primary_sub", primarySub);
    } catch (err) {
        // If already linked (409), that's fine — not a hard failure
        if (err?.statusCode === 409) {
            console.log("Identity already linked, skipping");
            api.idToken.setCustomClaim("linking_primary_sub", primarySub);
        } else {
            console.error("Linking failed:", err);
        }
    }
};


/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };
```