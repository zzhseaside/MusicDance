import {_decorator, Component, IQuatLike, Quat, Sprite} from 'cc';


const {ccclass, property} = _decorator;

@ccclass('MusicItem')
export class MusicItem extends Component {

    @property(Sprite)
    private sprite: Sprite = null

    protected onLoad() {
        this.sprite.material.setProperty("maxUVY", 0.0)
    }

    setHeight(height: number) {
        // 线性插值，不那么生硬
        let num = this.sprite.material.getProperty("maxUVY")
        let n = parseFloat(num.toString())
        let quat: IQuatLike = {
            x: 0,
            y: 0,
            z: 0,
            w: 0
        }
        let a: IQuatLike = {
            x: 0,
            y: n,
            z: 0,
            w: 0
        }
        let b: IQuatLike = {
            x: 0,
            y: height,
            z: 0,
            w: 0
        }
        let nh = Quat.lerp(quat, a, b, 0.4)
        let h = nh.y
        // h = Math.ceil(h * 10) / 10  //想要跳动为整个方块 就把数据取一下整,
        this.sprite.material.setProperty("maxUVY", h)
    }
}


