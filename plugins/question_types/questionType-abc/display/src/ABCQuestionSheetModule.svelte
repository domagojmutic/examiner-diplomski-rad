<svelte:options customElement="question-abc-sheet-module" />

<script lang="ts">
    export let question: string;

    const questionObject: {
        id: string;
        type: string;
        tags: string[];
        text: string;
        questionObject: {
            randomOrder: boolean;
            options: {
                text: string;
                required: boolean;
                correctAnswer: boolean;
            }[];
            showOptions: number;
        };
        answerObject: {};
    } = JSON.parse(question);

    let requiredOptions = questionObject.questionObject.options.filter(
        (option) => option.required
    ).length;

    const numberOfOptions = Math.max(
        questionObject.questionObject.showOptions,
        requiredOptions
    );
</script>

<div class="question">
    <ol class="options">
        {#each Array.from({ length: numberOfOptions }) as option}
            <li class="option"></li>
        {/each}
    </ol>
</div>

<style>
    .question {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
    }
    .options {
        font-weight: 400;
        font-size: 14px;
        margin: 0;

        display: flex;
        flex-direction: row;
        gap: 8px;

        padding-left: 0;

        counter-reset: opt;
        list-style-type: none;
    }
    .option {
        display: inline-block;
    }
    .option::before {
        counter-increment: opt;
        content: counter(opt, upper-alpha);

        display: inline-block;
        aspect-ratio: 1/1;
        height: 1lh;
        padding: 4px;
        border: 1px solid black;
        border-radius: 50%;
        line-height: 1rem;
        text-align: center;
    }
</style>
