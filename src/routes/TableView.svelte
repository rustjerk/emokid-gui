<script>
    import { locale, _ } from "svelte-i18n";
    import { flip } from "svelte/animate";
    import { fly } from "svelte/transition";

    import Plus from "svelte-material-icons/Plus.svelte";
    import Delete from "svelte-material-icons/Delete.svelte";

    import AppPage from "../components/AppPage.svelte";
    import CircleButton from "../components/CircleButton.svelte";
    import AddDialog from "../components/AddDialog.svelte";
    import TableColumn from "../components/TableColumn.svelte";
    import Checkbox from "../components/Checkbox.svelte";

    import { musicBands, username } from "../api.js";

    let fields = ["id", "owner", "name", "coordX", "coordY", "created", "np", "description", "genre", "studioName", "studioAddress"];

    let fieldFilterKinds = Array(fields.length).fill("regex");
    fieldFilterKinds[0] = "number";
    fieldFilterKinds[3] = "number";
    fieldFilterKinds[4] = "number";
    fieldFilterKinds[5] = "datetime";
    fieldFilterKinds[6] = "number";
    fieldFilterKinds[8] = "genre";

    let fieldSortOrder = Array(fields.length).fill(true);
    let fieldSort = 0;
    let fieldFilters = Array(fields.length);

    let fieldTransformers = {};

    for (const field of fields) {
        fieldTransformers[field] = (id) => id;
    }

    $: fieldTransformers.created = (date) => date.toLocaleString($locale);

    let rowsAll = [];
    let rowsProcessed = [];

    let addDialog;

    function processRows() {
        rowsProcessed = rowsAll.filter(row => {
            for (let i = 0; i < fields.length; i++) {
                if (!fieldFilters[i]) continue;
                let pred = fieldFilters[i].predicate;
                if (!pred) continue;
                if (!pred(row[fields[i]])) return false;
            }

            return true;
        });

        rowsProcessed.sort((a, b) => {
            let field = fields[fieldSort];
            let x = a[field];
            let y = b[field];
            if (!fieldSortOrder[fieldSort])
                [x, y] = [y, x];
            if (x == null) return -1;
            if (y == null) return 1;
            if (x < y) return -1
            if (x > y) return 1
            if (x == y)
                return a.id - b.id;
        });
    }

    function handleSortChange(i, event) {
        fieldSort = i;
        fieldSortOrder[i] = event.detail;
        processRows();
    }

    function handleFilterChange(i, event) {
        processRows();
    }

    function updateTableData(musicBands) {
        rowsAll = musicBands; 
        processRows();

        allSelected = rowsProcessed.every(row => row.selected);
    }

    $: updateTableData($musicBands);

    let allSelected = false;

    function selectAll(e) {
        for (const row of rowsProcessed) {
            row.selected = e.target.checked;
        }

        rowsProcessed = rowsProcessed;
    }

    function onChecked(e) {
        if (e.target.checked) {
            if (rowsProcessed.filter(row => row.selected).length == rowsProcessed.length - 1)
                allSelected = true;
        } else {
            allSelected = false;
        }
    }

    function onDelete() {
        for (const row of rowsProcessed) {
            if (row.owner != $username) continue;
            if (row.selected) musicBands.remove(row.id);
        }
    }

    let addDialogEdit = false;
    let addDialogID = 0;
    let addDialogBand = null;

    function add() {
        addDialogEdit = false;
        addDialogBand = addDialog.defaultBand;
        addDialog.show();
    }

    function edit(id) {
        addDialogEdit = true;
        addDialogID = id;
        addDialogBand = Object.assign({}, $musicBands.find(b => b.id == id));
        addDialog.show();
    }
</script>

<AppPage>
    <table>
        <thead>
            <th><Checkbox bind:checked={allSelected} on:input={selectAll} transparent/></th>
            {#each fields as field, i}
                <th><TableColumn sortActive={i == fieldSort} filterKind={fieldFilterKinds[i]}
                    bind:filter={fieldFilters[i]}
                    on:sortChange={ev => handleSortChange(i, ev)}
                    on:filterChange={ev => handleFilterChange(i, ev)} label={$_("field." + field)}></TableColumn></th>
            {/each}
        </thead>

        <tbody>
            {#each rowsProcessed as row (row.id)}
                <tr animate:flip="{{duration: 500}}" on:click={() => edit(row.id)}>
                    <td><Checkbox on:input={onChecked} bind:checked={row.selected} transparent/></td>
                    {#each fields as field}
                        <td>{row[field] == null ? $_("null") : fieldTransformers[field](row[field])}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
    
    <div class="button add">
        <CircleButton on:click={add}><Plus/></CircleButton>
    </div>

    {#if rowsProcessed.some(r => r.selected)}
        <div class="button delete" transition:fly="{{ x: 100, duration: 200 }}">
            <CircleButton color="#570b75" on:click={onDelete}><Delete/></CircleButton>
        </div>
    {/if}
</AppPage>

<AddDialog bind:this={addDialog} band={addDialogBand} isEdit={addDialogEdit} id={addDialogID}/>

<style>
    table {
        font-size: 14px;
        border-collapse: collapse;
        width: 100%;
        margin: 0 auto;
    }

    thead {
        background: #280438;
    }

    tbody {
        border-bottom: 1px solid #280438;
    }

    th, td {
        padding: 8px;
    }

    th {
        background: #280438;
        color: rgb(255 255 255 / 80%);
        position: sticky;
        top: 0;
        z-index: 10;
        box-shadow: 0 -1px #280438;
        border-left: 1px solid #280438;
        border-right: 1px solid #280438;
    }

    td {
        border-left: 1px solid #280438;
        border-right: 1px solid #280438;
    }

    tr:nth-child(even) {
        background: rgb(0 0 0 / 8%);
    }

    .button {
        position: fixed;
        bottom: 100px;
        right: 50px;
    }

    .button.delete {
        bottom: 180px;
    }

    tr {
        color: rgb(255 255 255 / 70%);
        transition: color 500ms ease, background-color 500ms ease;
    }

    tr:hover {
        color: #fff;
        background: rgb(255 255 255 / 5%);
        transition: color 150ms ease, background-color 150ms ease;
        cursor: pointer;
    }

</style>
