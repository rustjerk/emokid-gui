<script>
    import { _ } from "svelte-i18n";
    import { createEventDispatcher } from "svelte";

    import Label from "./Label.svelte";
    import Input from "./Input.svelte";
    import Spacer from "./Spacer.svelte";
    import Row from "./Row.svelte";
    import Button from "./Button.svelte";
    import ValidatedInput from "./ValidatedInput.svelte";

    export let state;

    let rangeStart = state.rangeStart;
    let rangeEnd = state.rangeEnd;

    export function cancel() {
        rangeStart = null;
        rangeEnd = null;
        submit();
    }

    const dispatch = createEventDispatcher();

    export function submit() {
        state.active = rangeStart != null && rangeEnd != null;
        state.rangeStart = rangeStart;
        state.rangeEnd = rangeEnd;
        state.predicate = (val) => {
            if (rangeStart != null && val < rangeStart) return false;
            if (rangeEnd != null && val > rangeEnd) return false;
            return true;
        };

        dispatch("submit");
    }

    function fromRaw(str) {
        const mapper = (str) => {
            let num = parseInt(str);
            if (isNaN(Number(str)) || isNaN(num)) throw new Error();
            return num;
        };

        let [left, right] = str.split(" ");

        let [day, month, year] = left.trim().split(".").map(mapper);
        let [hour, min, sec] = right.trim().split(":").map(mapper);

        let date = new Date();
        date.setFullYear(year);
        date.setMonth(month - 1);
        date.setDate(day);
        date.setHours(hour);
        date.setMinutes(min);
        date.setSeconds(sec);

        return date;
    }

    function intoRaw(date) {
        if (!date) return "";
        let D = date.getDate().toString().padStart(2, '0');
        let M = (date.getMonth() + 1).toString().padStart(2, '0');
        let Y = date.getFullYear().toString().padStart(4, '0');
        let h = date.getHours().toString().padStart(2, '0');
        let m = date.getMinutes().toString().padStart(2, '0');
        let s = date.getSeconds().toString().padStart(2, '0');
        return `${D}.${M}.${Y} ${h}:${m}:${s}`
    }
</script>

<ValidatedInput required={false} bind:value={rangeStart} {fromRaw} {intoRaw} label={$_("date.from")} placeholder={$_("date.placeholder")}/>

<ValidatedInput required={false} bind:value={rangeEnd} {fromRaw} {intoRaw} label={$_("date.to")} placeholder={$_("date.placeholder")}/>

<Spacer height=8/>
<Row>
    <Button on:click={cancel} transparent>{$_("clear")}</Button>
    <Button on:click={submit} type="submit">{$_("save")}</Button>
</Row>
