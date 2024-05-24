<script>
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    import { supabase } from "./lib/supaclient";

    let google = globalThis.google;
    let loginBtn;
    let dispatch = createEventDispatcher();

    async function postLogin(response) {
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
        });
        if (error) throw error;
        location.reload();
        // dispatch("loginDone", data.user); // this shi don work and i have one day
    }
    window.onload = function () {};

    onMount(() => {
        google.accounts.id.initialize({
            use_fedcm_for_prompt: true,
            client_id:
                "221575063928-600fstdnkbu22ehiljl2a7ohck8e4i2r.apps.googleusercontent.com",
            callback: postLogin,
        });

        google.accounts.id.renderButton(loginBtn, {
            theme: "outline",
            size: "medium",
        });

        google.accounts.id.prompt();
    });
</script>

<main>
    <div class="loginbtn" bind:this={loginBtn}></div>
</main>

<style>
    main {
        width: 100vw;
        height: calc(var(--vh, 1vh) * 100);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .loginbtn {
        max-width: 80vw;
    }
</style>
