class invertNumber {
    num;

    getNextNumber(index) {
        return this.getClockNumber(index);
    }

    getClockNumber(index) {
        const before = this.num[index];
        let after = before + 1;
        if (index % 2) {
            after = after > 9 ? 0 : after;
        } else {
            after = after >= 6 ? 0 : after;
        }
        return {
            before,
            after
        };
    }
}

class Clock extends invertNumber {
    main;
    divList;

    constructor(main) {
        super();
        this.main = document.querySelector(main);
    }

    render() {
        this.clock();
        this.getDiv();
        setInterval(() => {
            this.updateNumber();
        }, 20)
    }


    updateNumber() {
        this.getTimes();
        this.divList.forEach((divs, index) => {
            const div = divs[1];
            const {before, after} = this.getNextNumber(index);
            if (Number(div.dataset.before) !== before) {
                div.classList.add('filDown');
            }
            div.addEventListener('animationend', () => {
                divs.forEach((div) => {
                    div.dataset.before = before;
                    div.dataset.after = after;
                })
                div.classList.remove('filDown');
            })
        })
    }

    clock() {
        this.getTimes();
        this.createSectionElement();
    }

    getTimes() {
        this.num = new Date().toLocaleTimeString().replaceAll(/:/g, '').split('').map(n => +n)
    }

    createSectionElement() {
        this.num.forEach((number, index) => {
            this.main.insertAdjacentHTML('beforeend', `
            <section>
                    <div data-before="0" data-after="0"></div>
                    <div data-before="0" data-after="0"></div>
            </section>
        `)
            if (index % 2 && index !== this.num.length - 1) {
                this.main.insertAdjacentHTML('beforeend', `<p></p>`)
            }
        })
    }

    getDiv() {
        const sectionList = Array.from(this.main.querySelectorAll('section'));
        if (sectionList) {
            this.divList = sectionList.map((section) => section.querySelectorAll('div'))
        }
    }
}

const instance = new Clock('#el');

instance.render();

const time = dayjs().add(6, 'minute')
let hour = time.diff(dayjs(), 'hour');
let minute = time.diff(dayjs().add(hour, 'hour'), 'minute');
let seconds = time.diff(dayjs().add(hour, 'hour').add(minute, 'minute'), 'second');
hour = hour > 9 ? hour : '0' + hour;
minute = minute > 9 ? minute : '0' + minute;
seconds = seconds > 9 ? seconds : '0' + seconds;
let res = `${hour}:${minute}:${seconds}`

