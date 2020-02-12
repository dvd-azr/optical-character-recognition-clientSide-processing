const sampleBtn = document.querySelector('.sample'),
    processContainer = document.querySelector('.process-container'),
    prevContainer = document.querySelector('.img-preview'),
    runBtn = document.querySelector('.run'),
    imgPrev = document.querySelector('.img-preview img'),
    svgIcon = document.querySelector('.svg-icon'),
    processBtn = document.querySelector('.process-this'),
    uploadBtn = document.querySelector('.upload'),
    resultText = document.querySelector('#result-text'),
    copyBtn = document.querySelector('.copy-btn'),
    tooltip = document.getElementById("myTooltip"),
    process = document.querySelector('#process');

// resultText.addEventListener('mouseenter', function () {
//     // console.log('enter');
//     copyBtn.style = "opacity: 1"

// }, false);

// resultText.addEventListener('mouseleave', function () {
//     // console.log('leave');
//     copyBtn.style.opacity = "";

// }, false)


copyBtn.addEventListener('click', function () {
    let preText = resultText.querySelector('pre'),
        range = document.createRange(),
        selection = window.getSelection();

    range.selectNodeContents(preText);
    selection.removeAllRanges();
    selection.addRange(range);


    document.execCommand('copy');
    window.getSelection().removeAllRanges();


    // update tooltip text
    tooltip.innerHTML = "Copied";

    console.log(range.toString());

})

sampleBtn.addEventListener('click', function () {
    console.log('sample');
    // console.log(imgPrev.src);
    // console.log(this);

    imgPrev.src = 'puisi.jpg';
    imgPrev.style = 'display :block;';
    svgIcon.style = 'display :none';
    process.style = 'display :none';
    runBtn.style = 'display :inline-block';

    prevContainer.querySelector('.overlay').style = "display :none";

    // console.log(this.parentElement.parentElement.parentElement);
    process.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

})

prevContainer.addEventListener('mouseenter', function (e) {
    // console.log(e);
    // console.log(this.querySelector('.overlay').clientHeight);
    // console.log(this.querySelector('img').clientHeight);

    if (imgPrev.currentSrc == '') {
        // console.log("null mase");
        processBtn.style = 'display :none';
        sampleBtn.style = 'display :block';

    } else {

        processBtn.style = 'display :none';
        sampleBtn.style = 'display :none';
        this.querySelector('.overlay').style = 'display :none';
        // this.querySelector('.overlay').style = `height: ${this.querySelector('img').clientHeight}px; width: ${this.querySelector('img').clientWidth}px; `;
    }
    // console.log(imgPrev.currentSrc);


});
runBtn.addEventListener('click', function () {
    processBtn.click()
})

processBtn.addEventListener('click', function () {
    imgPrev.style = 'width:auto;  height: 500px; display :block;';
    process.style = 'display :block';
    prevContainer.style = 'width :30%';

    this.style = 'display :none';

    // prevContainer.querySelector('.overlay').style = `height: ${prevContainer.querySelector('img').clientHeight}px; width: ${prevContainer.querySelector('img').clientWidth}px`;



    recognizeFile(imgPrev.src);
});

uploadBtn.addEventListener('change', function (params) {
    const file = params.target.files[0];
    // console.log(params.target.files.length);
    this.querySelector('label').textContent = file.name;

    const reader = new FileReader();

    if (params.target.files.length > 0) {
        // prevContainer.style = 'width :100%';

        // console.log(reader);
        reader.readAsDataURL(file)
        reader.onload = function (re) {
            // console.log(re.target.result);
            imgPrev.src = re.target.result;
            imgPrev.style = 'width:100%; display :block';
            processBtn.style = 'display :none';
            process.style = 'display :none';
            prevContainer.style = 'width :100%';

            svgIcon.style = 'display :none';

            runBtn.style = 'display :inline-block';

            // prevContainer.querySelector('.overlay').style = `height: ${prevContainer.querySelector('img').clientHeight}px; width: ${prevContainer.querySelector('img').clientWidth}`;
        }
    }
});


/* ==============================================
* Tesseract Config
============================================== */

const winOrigin = window.origin;
console.log(winOrigin + window.location.pathname);
console.log(window.location.pathname);
// setting agar load dari localhost
window.Tesseract = Tesseract.create({
    // Path to worker
    workerPath: `${winOrigin+window.location.pathname}/main/worker.js`,
    // Path of folder where the language trained data is located
    langPath: `${winOrigin}/langsdata/`,
    // Path to index script of the tesseract core ! https://github.com/naptha/tesseract.js-core
    // corePath: "http://127.0.0.1:5500/index.js",
    corePath: `${winOrigin+window.location.pathname}/main/index.js`,
});



function recognizeFile(file) {
    process.innerHTML = '';
    process.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    Tesseract.recognize(file, document.querySelector('#langsel').value)
        .progress(function (packet) {
            // console.info(packet)
            progressUpdate(packet)

        })
        .then(function (data) {
            // console.log(data)
            progressUpdate({
                status: 'done',
                data: data
            })
        })
};


function progressUpdate(packet) {
    // var log = document.getElementById('log');
    const log = document.getElementById('process');
    const result = document.getElementById('result-text'),
        theText = result.querySelector('.the-text');

    if (log.firstChild && log.firstChild.status === packet.status) {

        if ('progress' in packet) {
            var progress = log.firstChild.querySelector('progress')
            progress.value = packet.progress
        }


    } else {
        var line = document.createElement('div');
        line.status = packet.status;

        var status = document.createElement('div')
        status.className = 'status'

        status.appendChild(document.createTextNode(packet.status))
        line.appendChild(status)



        if ('progress' in packet) {
            var progress = document.createElement('progress')
            progress.value = packet.progress
            progress.max = 1
            line.appendChild(progress)
        }


        if (packet.status == 'done') {
            // jika Telah selesai
            var pre = document.createElement('pre')
            pre.appendChild(document.createTextNode(packet.data.text))
            // line.innerHTML = ''
            // line.appendChild(pre)
            result.style = "display: block"
            theText.innerHTML = ''
            theText.appendChild(pre)

            result.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        log.insertBefore(line, log.firstChild)
        // log.insertAfter(line, log.lastChild)
    }
}