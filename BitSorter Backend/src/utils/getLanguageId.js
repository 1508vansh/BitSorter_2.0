const getLanguageId = (language)=>{
    const languagesValue = {
        'java':91,
        'c++':105,
        'cpp':105,
        'js':102,
        'javascript':102
    }
    return languagesValue[language.toLowerCase()];
}

module.exports = getLanguageId;