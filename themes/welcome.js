class WelcomeMessage {
    constructor() {
        this.static_welcome_message = [
            {
                title: "Arxiv论文翻译",
                content: "无缝切换学术阅读语言，最优英文转中文的学术论文阅读体验。",
                svg: "file=themes/svg/arxiv.svg",
                url: "https://github.com/zm50",
            },
            {
                title: "多模态模型",
                content: "试试将截屏直接粘贴到输入框中，随后使用多模态模型提问。",
                svg: "file=themes/svg/mm.svg",
                url: "https://github.com/zm50",
            },
            {
                title: "文档与源码批处理",
                content: "您可以将任意文件拖入「此处」，随后调用对应插件功能。",
                svg: "file=themes/svg/doc.svg",
                url: "https://github.com/zm50",
            },
            {
                title: "图表与脑图绘制",
                content: "试试输入一段语料，然后点击「总结绘制脑图」。",
                svg: "file=themes/svg/brain.svg",
                url: "https://github.com/zm50",
            },
            {
                title: "虚空终端",
                content: "点击右侧插件区的「虚空终端」插件，然后直接输入您的想法。",
                svg: "file=themes/svg/vt.svg",
                url: "https://github.com/zm50",
            },
            {
                title: "DALLE图像生成",
                content: "接入DALLE生成插画或者项目Logo，辅助头脑风暴并激发灵感。",
                svg: "file=themes/svg/img.svg",
                url: "https://github.com/zm50",
            },
            {
                title: "TTS语音克隆",
                content: "借助SoVits，以您喜爱的角色的声音回答问题。",
                svg: "file=themes/svg/tts.svg",
                url: "https://github.com/zm50",
            },
            {
                title: "实时语音对话",
                content: "配置实时语音对话功能，无须任何激活词，我将一直倾听。",
                svg: "file=themes/svg/default.svg",
                url: "https://github.com/zm50",
            },
            {
                title: "Latex全文润色",
                content: "上传需要润色的latex论文，让大语言模型帮您改论文。",
                svg: "file=themes/svg/polish.svg",
                url: "https://github.com/zm50",
            },
            {
                title: "接入更多新模型",
                content: "模型迭代日新月异，一起动手接入更多新的在线或本地大模型吧。",
                svg: "file=themes/svg/box.svg",
                url: "https://github.com/binary-husky/gpt_academic/blob/master/request_llms/README.md",
            },
            {
                title: "联动VLLM等服务",
                content: "借助VLLM和OneApi等第三方服务高效地部署和运行大模型。",
                svg: "file=themes/svg/location.svg",
                url: "https://github.com/binary-husky/gpt_academic/wiki/如何更便捷地接入one-api",
            },
        ];
        this.visible = false;
        this.max_welcome_card_num = 6;
        this.card_array = [];
        this.static_welcome_message_previous = [];
        this.reflesh_time_interval = 15 * 1000;
        this.update_time_interval = 2 * 1000;
        this.major_title = "欢迎使用智能科研助手";

        const reflesh_render_status = () => {
            for (let index = 0; index < this.card_array.length; index++) {
                const card = this.card_array[index];
                card.classList.remove('hide');
                card.classList.remove('show');
            }
        };
        const pageFocusHandler = new PageFocusHandler();
        pageFocusHandler.addFocusCallback(reflesh_render_status);

        // call update when page size change, call this.update when page size change
        window.addEventListener('resize', this.update.bind(this));
        // add a loop to reflesh cards
        this.startRefleshCards();
        this.startAutoUpdate();
    }

    begin_render() {
        this.update();
    }

    async startAutoUpdate() {
        // sleep certain time
        await new Promise(r => setTimeout(r, this.update_time_interval));
        this.update();
    }

    async startRefleshCards() {
        // sleep certain time
        await new Promise(r => setTimeout(r, this.reflesh_time_interval));
        // checkout visible status
        if (this.visible) {
            // if visible, then reflesh cards
            await this.reflesh_cards();
            setTimeout(() => {
                this.startRefleshCards.call(this);
            }, 1);
        }
    }

    async reflesh_cards() {
        if (!this.visible) {
            return;
        }

        // re-rank this.static_welcome_message randomly
        this.static_welcome_message_temp = this.shuffle(this.static_welcome_message);

        // find items that in this.static_welcome_message_temp but not in this.static_welcome_message_previous
        const not_shown_previously = this.static_welcome_message_temp.filter(item => !this.static_welcome_message_previous.includes(item));
        const already_shown_previously = this.static_welcome_message_temp.filter(item => this.static_welcome_message_previous.includes(item));

        // combine two lists
        this.static_welcome_message_previous = not_shown_previously.concat(already_shown_previously);
        this.static_welcome_message_previous = this.static_welcome_message_previous.slice(0, this.max_welcome_card_num);

        (async () => {
            // 使用 for...of 循环来处理异步操作
            for (let index = 0; index < this.card_array.length; index++) {
                if (index >= this.max_welcome_card_num) {
                    break;
                }

                const card = this.card_array[index];
                // 已经包含了 hide 属性？
                if (card.classList.contains('hide') || card.classList.contains('show')) {
                    card.classList.remove('hide');
                    card.classList.remove('show');
                    continue;
                }


                card.classList.add('hide');
                const timeout = 100; // 与CSS中transition的时间保持一致(0.1s)
                setTimeout(() => {
                    // 更新卡片信息
                    const message = this.static_welcome_message_previous[index];
                    const title = card.getElementsByClassName('welcome-card-title')[0];
                    const content = card.getElementsByClassName('welcome-content-c')[0];
                    const svg = card.getElementsByClassName('welcome-svg')[0];
                    const text = card.getElementsByClassName('welcome-title-text')[0];
                    svg.src = message.svg;
                    text.textContent = message.title;
                    text.href = message.url;
                    content.textContent = message.content;
                    card.classList.remove('hide');
                    // 等待动画结束
                    card.classList.add('show');
                    const timeout = 100; // 与CSS中transition的时间保持一致(0.1s)
                    setTimeout(() => {
                        card.classList.remove('show');
                    }, timeout);
                }, timeout);


                // 等待 250 毫秒
                await new Promise(r => setTimeout(r, 200));
            }
        })();
    }

    shuffle(array) {
        var currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    async can_display() {
        // update the card visibility
        const elem_chatbot = document.getElementById('gpt-chatbot');
        const chatbot_top = elem_chatbot.getBoundingClientRect().top;
        const welcome_card_container = document.getElementsByClassName('welcome-card-container')[0];
        // detect if welcome card overflow
        let welcome_card_overflow = false;
        if (welcome_card_container) {
            const welcome_card_top = welcome_card_container.getBoundingClientRect().top;
            if (welcome_card_top < chatbot_top) {
                welcome_card_overflow = true;
            }
        }
        var page_width = document.documentElement.clientWidth;
        const width_to_hide_welcome = 1200;
        if (!await this.isChatbotEmpty() || page_width < width_to_hide_welcome || welcome_card_overflow) {
            // cannot display
            return false;
        }
        return true;
    }

    async update() {
        const can_display = await this.can_display();
        if (can_display && !this.visible) {
            this.showWelcome();
            return;
        }
        if (!can_display && this.visible) {
            this.removeWelcome();
            return;
        }
    }

    showCard(message) {
        const card = document.createElement('div');
        card.classList.add('welcome-card');

        // 创建标题
        const title = document.createElement('div');
        title.classList.add('welcome-card-title');

        // 创建图标
        const svg = document.createElement('img');
        svg.classList.add('welcome-svg');
        svg.src = message.svg;
        svg.style.height = '30px';
        title.appendChild(svg);

        // 创建标题
        const text = document.createElement('a');
        text.textContent = message.title;
        text.classList.add('welcome-title-text');
        text.href = message.url;
        text.target = "_blank";
        title.appendChild(text)

        // 创建内容
        const content = document.createElement('div');
        content.classList.add('welcome-content');
        const content_c = document.createElement('div');
        content_c.classList.add('welcome-content-c');
        content_c.textContent = message.content;
        content.appendChild(content_c);

        // 将标题和内容添加到卡片 div 中
        card.appendChild(title);
        card.appendChild(content);
        return card;
    }

    async showWelcome() {
        this.visible = true;
        // 首先，找到想要添加子元素的父元素
        const elem_chatbot = document.getElementById('gpt-chatbot');

        // 创建一个新的div元素
        const welcome_card_container = document.createElement('div');
        welcome_card_container.classList.add('welcome-card-container');

        // 创建主标题
        const major_title = document.createElement('div');
        major_title.classList.add('welcome-title');
        major_title.textContent = this.major_title;
        welcome_card_container.appendChild(major_title)

        // 创建卡片
        this.static_welcome_message.forEach((message, index) => {
            if (index >= this.max_welcome_card_num) {
                return;
            }
            this.static_welcome_message_previous.push(message);
            const card = this.showCard(message);
            this.card_array.push(card);
            welcome_card_container.appendChild(card);
        });

        elem_chatbot.appendChild(welcome_card_container);
        const can_display = await this.can_display();
        if (!can_display) {
            // undo
            this.visible = false;
            this.card_array = [];
            this.static_welcome_message_previous = [];
            elem_chatbot.removeChild(welcome_card_container);
            await new Promise(r => setTimeout(r, this.update_time_interval / 2));
            return;
        }

        // 添加显示动画
        requestAnimationFrame(() => {
            welcome_card_container.classList.add('show');
        });
    }

    async removeWelcome() {
        this.visible = false;
        // remove welcome-card-container
        const elem_chatbot = document.getElementById('gpt-chatbot');
        const welcome_card_container = document.getElementsByClassName('welcome-card-container')[0];
        // begin hide animation
        welcome_card_container.classList.add('hide');
        welcome_card_container.addEventListener('transitionend', () => {
            elem_chatbot.removeChild(welcome_card_container);
            this.card_array = [];
            this.static_welcome_message_previous = [];
        }, { once: true });
        // add a fail safe timeout
        const timeout = 600; // 与 CSS 中 transition 的时间保持一致(1s)
        setTimeout(() => {
            if (welcome_card_container.parentNode) {
                elem_chatbot.removeChild(welcome_card_container);
            }
        }, timeout);
    }

    async isChatbotEmpty() {
        return (await get_data_from_gradio_component("gpt-chatbot")).length == 0;
    }


}




class PageFocusHandler {
    constructor() {
        this.hasReturned = false;
        this.focusCallbacks = [];

        // Bind the focus and blur event handlers
        window.addEventListener('visibilitychange', this.handleFocus.bind(this));
    }

    // Method to handle the focus event
    handleFocus() {
        if (this.hasReturned) {
            this.focusCallbacks.forEach(callback => callback());
        }
        this.hasReturned = true;
    }

    // Method to add a custom callback function
    addFocusCallback(callback) {
        if (typeof callback === 'function') {
            this.focusCallbacks.push(callback);
        } else {
            throw new Error('Callback must be a function');
        }
    }
}


