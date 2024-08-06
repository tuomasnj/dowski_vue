<template>
    <div>
        <page-main class="photoUpload">
            11111
        </page-main>
    </div>
</template>

<script>

</script>

<style lang="scss" scoped>
[data-mode=mobile] {
    .photoUpload {
        font-size: 5px;
    }
}
[data-mode=pc] {
    .photoUpload {
        width: 100%;
        height: 100vh;
        background: url('../../assets/images/cloud.jpg') no-repeat center center/cover;
        position: relative;
    }
}
</style>
