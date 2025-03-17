<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="mx-auto max-w-7xl">
	<nav class="flex items-center justify-between py-5">
		<div class="text-2xl font-semibold">
			<a href="/"
				><span class="text-green-500"> Health </span>
				Connect
			</a>
		</div>
		<div class="flex gap-6">
			<a href="/login" aria-label="login">
				<span class="rounded-sm"> Login </span>
			</a>
			<a href="/login" aria-label="Sign Up">
				<span class="rounded-sm">Sign Up</span>
			</a>
		</div>
	</nav>

	{@render children()}
</div>
