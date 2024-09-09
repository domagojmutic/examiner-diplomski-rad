<svelte:options customElement="question-text-display" />

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
    <span class="title">{questionObject.text}</span>
</div>

<style>
    .title {
        font-weight: 600;
        font-size: 14px;
    }
</style>
