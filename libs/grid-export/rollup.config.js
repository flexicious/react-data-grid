module.exports = (currentConfig) => {
    if (currentConfig.output.format === 'esm') {
        currentConfig.output.preserveModules = true;
    }
    return {
        ...currentConfig,
    }
}