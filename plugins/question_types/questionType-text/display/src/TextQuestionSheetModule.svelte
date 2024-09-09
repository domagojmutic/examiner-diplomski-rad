<svelte:options customElement="question-text-sheet-module" />

<script lang="ts">
    export let question: string;

    const questionObject: {
        id: string;
        type: string;
        tags: string[];
        text: string;
        questionObject: {};
        answerObject: {};
    } = JSON.parse(question);
</script>

<div>
    <div class="textArea"></div>
</div>

<style>
    .textArea {
        width: 100%;
        height: 2lh;
        border: 1px solid black;
        box-sizing: border-box;
    }
</style>
