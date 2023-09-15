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
                    div.dataset.before = num;
                    div.dataset.after = num+1;
                })
            })
        },500)
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
                    <div data-before=${number} data-after="4"></div>
                    <div data-before=${number} data-after="4"></div>
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