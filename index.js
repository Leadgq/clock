class invertNumber {
    num;
    type;
    options;
    endTime;
    timer;
    isSplitHour = true;

    constructor(options) {
        if (!options) return;
        this.options = options;
        const { type } = options;
        this.type ??= type ?? 'clock';
        if (this.type !== 'clock') {
            this.setEndTime(options?.timing);
        }
    }

    // 获取数字
    getNumbers() {
        this.type === 'clock' ? this.updateLockView() : this.updateCountdownDisplay();
    }

    // 更新倒计时
    updateCountdownDisplay() {
        this.num = this.getDiffTime(this.endTime).replaceAll(/:/g, '').split('').map(n => +n);
        this.isHourRemovalPossible();
        this.isStopInterVal();
    }

    isHourRemovalPossible() {
        // 没有小时的时候,并且没有进位,去掉前面的0
        if (!this.options.timing?.hour && this.num[0] === 0 && this.num[1] === 0 && this.isSplitHour) {
            this.num = this.num.slice(2);
        }
    }

    isStopInterVal() { 
        const stopTiming = this.num.every(item => item === 0);
        if (!!stopTiming) {
            clearInterval(this.timer)
        }
    }


    // 每次更新的时候,更新时钟数字
    updateLockView() {
        this.num = new Date().toLocaleTimeString().replaceAll(/:/g, '').split('').map(n => +n)
    }

    getNextNumber(index) {
        return this.type === 'clock' ? this.getNextClockNumber(index) : this.getNextCountDownNumber(index);
    }

    //  获取下一个数字
    getNextCountDownNumber(index) {
        const before = this.num[index];
        let after = before - 1;
        if (index % 2) {
            // 小时
            if (index === 1 && this.num.length === 6) {
                this.isSplitHour = false;
                after = 0;
            } else {
                after = after < 0 ? 9 : after;
            }
        } else {
            if (index === 1 && this.num.length === 4) {
                after = 0;
            } else {
                after = after < 0 ? 5 : after;
            }
        }
        return {
            before,
            after
        };
    }

    // 获取时钟数字
    getNextClockNumber(index) {
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

    setEndTime(timing) {
        if (!timing) return;
        const { hour = 0, minute = 0, seconds = 0 } = timing;
        this.endTime = dayjs().add(hour, 'hour').add(minute, 'minute').add(seconds, 'second');
    }

    // 获取当前时间和未来时间的差值
    getDiffTime(time) {
        let hour = time.diff(dayjs(), 'hour');
        let minute = time.diff(dayjs().add(hour, 'hour'), 'minute');
        let seconds = time.diff(dayjs().add(hour, 'hour').add(minute, 'minute'), 'second');
        hour = hour > 9 ? hour : '0' + hour;
        minute = minute > 9 ? minute : '0' + minute;
        seconds = seconds > 9 ? seconds : '0' + seconds;
        return `${hour}:${minute}:${seconds}`;
    }
}

class Clock extends invertNumber {
    main;
    divList;

    constructor(options) {
        super(options);
        if (options.el) {
            this.main = document.querySelector(options?.el);
        } else {
            throw new Error('el is not defined');
        }
    }

    render() {
        this.clock();
        this.getDiv();
        this.setStyle();
        this.continue();
    }
    
    setStyle() {
        const { style = 'index' } = this.options;
        document.head.insertAdjacentHTML('afterbegin', `
       <link rel="stylesheet" href="${style}.css">
       `)
    }

    updateNumber() {
        this.getNumbers();
        this.divList.forEach((divs, index) => {
            const div = divs[1];
            const { before, after } = this.getNextNumber(index);
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
        this.getNumbers();
        this.createSectionElement();
    }

    stop() {
        clearInterval(this.timer)
    }

    continue() {
        this.timer = setInterval(() => {
            this.updateNumber();
        }, 20)
    }

    createSectionElement() {
        this.num.forEach((number, index) => {
            const { before, after } = this.getNextNumber(index)
            this.main.insertAdjacentHTML('beforeend', `
            <section>
                <div data-before="${before}" data-after="${after}"></div>
                <div data-before="${before}" data-after="${after}"></div>
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

