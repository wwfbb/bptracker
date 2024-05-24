<script>
    import { currentUserEmail, signInUser, supabase } from "../lib/supaclient";
    import {
        grantAccessTo,
        getAccessGrantees,
        revokeAccess,
        isGranteeOf,
        switchToUser,
    } from "../lib/access";
    import { currentPageId, Screen } from "../lib/navigation";

    let accessGrantedTo = [];
    let accessGrantedBy = [];

    async function addUser() {
        let newUserEmail = prompt("Email address to give access to:");
        await grantAccessTo(newUserEmail);
        accessGrantedTo = await getAccessGrantees();
    }

    let accessGivenTo = new Promise(async (resolve, __reject) => {
        accessGrantedTo = await getAccessGrantees();
        console.log(accessGrantedTo);
        resolve();
    });

    let accessGivenBy = new Promise(async (resolve, __reject) => {
        accessGrantedBy = await isGranteeOf();
        console.log(accessGrantedBy);
        resolve();
    });

    function confirmDelete(to) {
        return async () => {
            if (confirm(`Revoke access from ${to}`)) {
                await revokeAccess(to);
                accessGrantedTo = await getAccessGrantees();
            }
        };
    }
</script>

<main>
    <h1>Sync Settings</h1>

    <div class="info">
        <div class="field">Signed in as:</div>

        <div class="value">
            <div class="list-item">
                {signInUser.email}
            </div>
        </div>
    </div>

    <div class="info">
        <div class="field">Syncing info to:</div>

        <div class="value">
            <div class="list-item">
                {$currentUserEmail}
            </div>
        </div>
    </div>

    <h2>Account Sharing</h2>

    <div class="info">
        <div class="field">Users with access to your account:</div>
        <div class="value">
            {#await accessGivenTo}
                Loading....
            {:then}
                {#each accessGrantedTo as account}
                    <li>
                        <button
                            class="list-item"
                            on:click={confirmDelete(account.to)}
                        >
                            {account.to}
                        </button>
                    </li>
                {/each}
            {/await}
            <button class="list-item" on:click={addUser}>Add user +</button>
        </div>
    </div>
    <div class="info">
        <div class="field">Users accounts you have access to:</div>
        <div class="value">
            {#await accessGivenBy}
                Loading....
            {:then}
                {#each accessGrantedBy as account}
                    <button
                        class="list-item"
                        on:click={() => {
                            switchToUser(account.on_email, account.on);
                        }}
                    >
                        {account.on_email}
                    </button>
                {/each}
            {/await}

            <button
                class="list-item"
                on:click={() => {
                    switchToUser(signInUser.email, signInUser.id);
                }}
            >
                Your Account
            </button>
        </div>
    </div>

    <h2>View Raw Data</h2>
    <div class="info">
        <div class="value">
            <button
                class="list-item"
                on:click={() => {
                    currentPageId.set(Screen.RAW_DATA);
                }}>View Raw Data</button
            >
        </div>
    </div>

    <h2>Sign out</h2>
    <div class="info">
        <div class="value">
            <button
                class="list-item"
                on:click={async () => {
                    await supabase.auth.signOut();
                    location.reload();
                }}>Sign Out</button
            >
        </div>
    </div>
</main>

<style>
    h1 {
        font-family: "Noto Sans", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
        font-variation-settings: "wdth" 100;
        margin-bottom: 16px;
    }

    @keyframes liSkeleton {
        from {
            background-position: 0% 100%;
        }
        to {
            background-position: 100% 0%;
        }
    }
    li {
        margin: 3px;
        list-style: none;
    }

    button.list-item {
        color: #99f;
        padding: 10px 16px;
        padding-left: 4px;
        width: 100%;
        font-size: 100%;
        text-align: left;
        border: none;
        background: none;
    }

    main {
        color: #fff;
        padding: 32px;

        font-family: "Noto Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-variation-settings: "wdth" 100;
    }

    .info {
        padding: 4px;
    }

    .field,
    .value {
        font-size: 110%;
    }

    .value {
        padding: 8px;
        color: #99f;
    }
</style>
