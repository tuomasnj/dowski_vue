<template>
    <div>
        <page-main>
            <el-calendar v-model="curDate" @input="handle">
                <div
                    slot="dateCell"
                    slot-scope="{ data }"
                >
                    <p>
                        {{ data.day.split("-").slice(1).join("-") }}{{ data.isSelected ? '✅' : '' }}
                    </p>
                </div>
            </el-calendar>
        </page-main>
    </div>
</template>

<script>
export default {
    data() {
        return {
            curDate: new Date()
        }
    },
    methods: {
        handle(data) {
            alert(data)
        }
    }

}
</script>
