<template>
    <div class="textInput">
        <el-input
            v-model="localValue"
            :rows="rows"
            :placeholder="placeholder"
            type="textarea"
            autosize
            :disabled="disable"
        />
        <i
            v-show="clearable && localValue && !disable"
            class="clearButton el-input__icon el-icon-circle-close el-input__clear"
            @click.prevent="localValue=''"
        />
    </div>
</template>

<script>
export default {
    name: 'ClearableTextInput',
    props: {
        values: {
            type: String,
            default: function() {
                return ''
            }
        },
        placeholder: {
            type: String,
            default: ''
        },
        clearable: {
            type: Boolean,
            default: false
        },
        disable: {
            type: Boolean,
            default: false
        },
        rows: {
            type: Number,
            default: 1
        },
        inputChange: {
            type: Function,
            default: null
        }
    },
    computed: {
        localValue: {
            get() {
                return this.values
            },
            set(value) {
                this.$emit('input', value)
            }
        }
    }

}
</script>

  <style lang="scss" scoped>
    .textInput {
        position: relative;
        .clearButton {
            position: absolute;
            border-radius: 5px;
            right: 0;
            z-index: 2;
            border: none;
            top: -3px;
            height: 40px;
            cursor: pointer;
            color: #ccc;
            transform: translateX(4px);
        }
        .clearButton:hover {
            color: #878d99;
        }
    }
  </style>
