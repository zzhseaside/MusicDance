import {_decorator, AudioClip, Component, instantiate, Layout, Prefab} from 'cc';
import {MusicItem} from "./MusicItem";

const {ccclass, property} = _decorator;

const RATE = 128 // 采样长度
@ccclass('Music')
export class Music extends Component {

    @property(AudioClip)
    private audioClip: AudioClip = null
    @property(Layout)
    private layout: Layout = null
    @property(Prefab)
    private itemPrefab: Prefab = null

    private audioBufferSourceNode: AudioBufferSourceNode = null
    private analyser: AnalyserNode = null
    private audioContext: any = null
    onLoad() {

        // 实例化 item
        this.layout.node.removeAllChildren()
        for (let i = 0; i < RATE; i++) {
            let n = instantiate(this.itemPrefab);
            n.parent = this.layout.node
        }

        // @ts-ignore
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

        let AudioContext = window.AudioContext;
        // audioContext 只相当于一个容器。
        this.audioContext = new AudioContext();
        // 要让 audioContext 真正丰富起来需要将实际的音乐信息传递给它的。
        // 也就是将 AudioBuffer 数据传递进去。
        // 以下就是创建音频资源节点管理者。
        this.audioBufferSourceNode = this.audioContext.createBufferSource();
        // 将 AudioBuffer 传递进去。
        // @ts-ignore
        this.audioBufferSourceNode.buffer = this.audioClip._nativeAsset.player._player._audioBuffer;
        // 创建分析器。
        this.analyser = this.audioContext.createAnalyser();
        // 精度设置
        this.analyser.fftSize = 256;
        // 在传到扬声器之前，连接到分析器。
        this.audioBufferSourceNode.connect(this.analyser);
        // 连接到扬声器。
        this.analyser.connect(this.audioContext.destination);
        // 开始播放
        this.audioBufferSourceNode.start(0);
    }

    update(dt:number) {
        // 等待准备好
        if (!this.analyser) return;
        if (this.getCurrentTime() >= this.audioClip.getDuration()) {
            return;
        }
        // 建立数据准备接受数据
        let dataArray: Uint8Array = new Uint8Array(this.analyser.frequencyBinCount);
        // 分析结果存入数组。
        this.analyser.getByteFrequencyData(dataArray);

        for (let j = 0; j < dataArray.length; j++) {
            let it = dataArray[j]
            let node = this.layout.node.children[j];
            if (node) {
                node.getComponent(MusicItem).setHeight(it / 255)
            }
        }
    }

    getCurrentTime() {
        if (this.audioContext) {
            return this.audioContext.currentTime
        }
        return 0
    }
}


