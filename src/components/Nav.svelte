<script>
    import { _ } from "svelte-i18n";
    import { navigate } from "svelte-navigator";

    import Table from "svelte-material-icons/Table.svelte";
    import ChartScatterPlot from "svelte-material-icons/ChartScatterPlot.svelte";
    import Account from "svelte-material-icons/Account.svelte";
    import Console from "svelte-material-icons/Console.svelte";

    import Button from "./Button.svelte";
    import LanguageSelector from "./LanguageSelector.svelte";
    import NavLink from "./NavLink.svelte";
</script>

<nav>
    <div class="segment">
        <NavLink link="/account" text={$_("account")}><Account/></NavLink>
    </div>
    <div class="segment">
        <NavLink link="/table" text={$_("table_view")}><Table/></NavLink>
        <NavLink link="/area" text={$_("area_view")}><ChartScatterPlot/></NavLink>
        <!--<NavLink link="/commands" text={$_("commands")}><Console/></NavLink>-->
    </div>
    <div class="segment">
        <div class="version">v1.0.0</div>
        <LanguageSelector/>
    </div>
</nav>

<style>
    nav {
        position: relative;
        z-index: 50;
        display: flex;
        flex-flow: row nowrap;
        background: #280438;
        padding: 12px;
        box-shadow: 0 -4px 8px rgb(0 0 0 / 30%);
    }

    .segment {
        display: flex;
        flex: 1 1 auto;
        align-items: center;
        gap: 40px;
    }

    .segment:nth-of-type(2) {
        justify-content: center;
    }

    .segment:nth-of-type(3) {
        justify-content: flex-end;
    }

    .version {
        color: rgb(255 255 255 / 30%);
        font-size: 12px;
    }
</style>
