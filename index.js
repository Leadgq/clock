class Clock {
    #main;
    #num;
    #divList;
    constructor(main) {
        this.#main = document.querySelector(main);
    }
    render() {
        this.#clock();
        this.#getDiv();
        this.#loopRenderTime();
    }

    #loopRenderTime() {
        setInterval(() => {
            this.#getTimes();
            this.#divList.forEach((divs, index) => {
                divs.forEach((div) => {
                    const num = this.#num[index];
                    if (div.dataset.before != num) {
                        div.classList.add('filDown');
                    }
                    div.addEventListener('animationend', () => {
                        divs.forEach((div) => {
                            div.dataset.before = num;
                            const after = num + 1;
                            if (index % 2) {
                                div.dataset.after = after > 9 ? 0 : num;
                            } else {
                                div.dataset.after = after >= 6 ? 0 : num;
                            }
                        })
                        div.classList.remove('filDown');
                    })
                })
            })
        }, 200)

    }

    #clock() {
        this.#getTimes();
        this.#createSectionElement();
    }
    #getTimes() {
        this.#num = new Date().toLocaleTimeString().replaceAll(/:/g, '').split('').map(n => +n)
    }
    #createSectionElement() {
        this.#num.forEach((number,index) => {
            this.#main.insertAdjacentHTML('beforeend', `
            <section>
                    <div data-before=0 data-after=0></div>
                    <div data-before=0 data-after=0></div>
            </section>
        `)
            if (index % 2 && index !== this.#num.length - 1 ) {
                this.#main.insertAdjacentHTML('beforeend',`<p></p>`)
            }
        })
    }

    #getDiv() {
        const sectionList = Array.from(this.#main.querySelectorAll('section'));
        if (sectionList) {
            this.#divList = sectionList.map((section) => section.querySelectorAll('div'))
        }
    }
}
const instance = new Clock('#el');

instance.render();
