<svelte:options customElement="question-abc-display" />

<script lang="ts">
    export let question: string;
    export let seed: number;

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

    function questionInstance(object: {
        randomOrder: boolean;
        options: {
            text: string;
            required: boolean;
            correctAnswer: boolean;
        }[];
        showOptions: number;
    }) {
        if (object.options.length <= object.showOptions) return object;

        const optionsList: {
            text: string;
            required: boolean;
            correctAnswer: boolean;
        }[] = [];
        const helperList: {
            text: string;
            required: boolean;
            correctAnswer: boolean;
        }[] = [];

        object.options.forEach((option) => {
            if (option.required) optionsList.push(option);
            else helperList.push(option);
        });

        if (optionsList.length >= object.showOptions)
            return { ...object, options: optionsList };

        for (
            let i = 0;
            i <
            Math.min(
                object.showOptions - optionsList.length,
                helperList.length
            );
            i++
        ) {
            const index = seed % helperList.length;
            optionsList.push(helperList[index]);
            helperList.splice(index, 1);
        }

        if (!object.randomOrder)
            return {
                ...object,
                options: object.options.filter((option) =>
                    optionsList.includes(option)
                ),
            };

        return { ...object, options: optionsList };
    }

    const computedQuestion = questionInstance(questionObject.questionObject);
</script>

<div class="question">
    <span class="title">{questionObject.text}</span>
    <ol class="options" style="list-style-type: upper-alpha;">
        {#each computedQuestion.options as option}
            <li class="option">{option.text}</li>
        {/each}
    </ol>
</div>

<style>
    .question {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
    }
    .title {
        font-weight: 600;
        font-size: 14px;
    }
    .options {
        font-weight: 400;
        font-size: 14px;
        margin: 0;
    }
</style>
