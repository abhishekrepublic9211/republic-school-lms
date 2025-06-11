<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Menu, User, LogOut, LogIn, CreditCard, Home } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	const dispatch = createEventDispatcher();

	function handleLogout() {
		authStore.logout();
		goto('/login');
	}

	// Default avatar if user has no profile picture
	const defaultAvatar = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';
</script>

<nav class="bg-white shadow-sm border-b border-gray-200 px-4 py-3 relative">
	<div class="flex items-center justify-between">
		<!-- Left side -->
		<div class="flex items-center space-x-4">
			{#if $authStore.isAuthenticated}
				<button
					class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
					on:click={() => dispatch('toggleSidebar')}
					aria-label="Toggle sidebar"
				>
					<Menu class="w-5 h-5 text-gray-600" />
				</button>
			{/if}

			<!-- Logo and Page Title -->
			<div class="flex items-center space-x-4">
				<a href="/" class="flex items-center space-x-3">
					<div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-xl">R</span>
					</div>
					<div class="hidden sm:block">
						<h1 class="text-xl font-bold text-gray-900">Republic School</h1>
						<p class="text-xs text-gray-500">of Journalism</p>
					</div>
				</a>
			</div>
		</div>

		<!-- Right side -->
		<div class="flex items-center space-x-4">
			{#if $authStore.isAuthenticated && $authStore.user}
				<a href="/payments" class="text-gray-600 hover:text-purple-600 flex items-center space-x-1 text-sm">
					<CreditCard class="w-4 h-4" />
					<span>Payments</span>
				</a>
				<div class="relative">
					<a href="/profile" class="flex items-center space-x-2">
						<img
							src={$authStore.user.profileData?.personal?.profilePhoto || defaultAvatar}
							alt="User avatar"
							class="w-8 h-8 rounded-full object-cover"
						/>
						<span class="hidden sm:inline font-medium text-sm text-gray-700">
							{$authStore.user.firstName || 'User'}
						</span>
					</a>
				</div>
				<button on:click={handleLogout} class="text-gray-600 hover:text-purple-600 flex items-center space-x-1 text-sm">
					<LogOut class="w-4 h-4" />
					<span>Sign Out</span>
				</button>
			{:else}
				<a href="/login" class="text-gray-600 hover:text-purple-600 flex items-center space-x-1 text-sm">
					<LogIn class="w-4 h-4" />
					<span>Login</span>
				</a>
			{/if}
		</div>
	</div>
</nav>
