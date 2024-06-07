<script lang="ts">
	import { slide } from "svelte/transition";
	import Views from "./Views.svelte";
	import Navbar from "./Navbar.svelte";

	import { checkAuthStatus, loginDone } from "./lib/supaclient";
	import Login from "./Login.svelte";
	import { currentUserEmail, signInUser } from "./lib/supaclient";
	import { onMount } from "svelte";

	onMount(() => {
		if (window.innerWidth > 600) {
			console.log("Moving to desktop");
			location.href = "/desktop.html";
		}
	});
</script>

<main>
	{#await checkAuthStatus() then isLoggedIn}
		{#if isLoggedIn}
			{#if signInUser.email != $currentUserEmail}
				<div class="currentAccount" transition:slide>
					{$currentUserEmail}
				</div>
			{/if}
			<Views />
			<Navbar />
		{:else}
			<Login on:loginDone={loginDone} />
		{/if}
	{/await}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: calc(var(--vh, 1vh) * 100);
		max-height: 100vh;
		width: 100vw;
		overflow: hidden;
	}

	div {
		background: #fff4;
		color: #fff;
		width: 100vw;
		font-family: sans-serif;
		font-size: 110%;
		display: flex;
		justify-content: center;
	}
</style>
