enum LightMode {
    //% block="BREATH"
    //% block.loc.cs="ZAPNOUT"
    BREATH,
    //% block="OFF"
    //% block.loc.cs="VYPNOUT"
    OFF
}
enum MotorList {
    //% block="M1"
    M1,
    //% block="M2"
    M2
}
enum ServoList {
    //% block="S0" enumval=0
    S0,
    //% block="S1" enumval=1
    S1,
    //% block="S2" enumval=2
    S2,
    //% block="S3" enumval=3
    S3,
    //% block="S4" enumval=4
    S4,
    //% block="S5" enumval=5
    S5,
    //% block="S6" enumval=6
    S6,
    //% block="S7" enumval=7
    S7
}
enum ServoTypeList {
    //% block="180°" 
    _180,
    //% block="270°"
    _270,
    //% block="360°" 
    _360
}
//% color=#ff7f24 icon="\uf2db"
namespace wuKong {
    const board_address = 0x10

    //% weight=99
    //% block="set light mode to %mode"
    //% block.loc.cs="světla $mode"
    export function setLightMode(mode: LightMode): void {
        let buff = pins.createBuffer(4);
        switch (mode) {
            case LightMode.BREATH:
                buff[0] = 0x11;
                buff[1] = 0x00;
                buff[2] = 0;
                buff[3] = 0;
                pins.i2cWriteBuffer(board_address, buff);
                buff[0] = 0x12;
                buff[1] = 150;
                basic.pause(100);
                pins.i2cWriteBuffer(board_address, buff);
                break;
            case LightMode.OFF:
                buff[0] = 0x12;
                buff[1] = 0;
                buff[2] = 0;
                buff[3] = 0;
                pins.i2cWriteBuffer(board_address, buff);
                buff[0] = 0x11;
                buff[1] = 160;
                basic.pause(100);
                pins.i2cWriteBuffer(board_address, buff);
                break;
            default:
                break;
        }
    }
    //% weight=98
    //% block="set light intensity to %light"
    //% light.min=0 light.max=100
    //% block.loc.cs="nastavit intenzitu světla na $light"
    export function lightIntensity(light: number): void {
        let buff = pins.createBuffer(4);
        buff[0] = 0x12;
        buff[1] = light;
        buff[2] = 0;
        buff[3] = 0;
        pins.i2cWriteBuffer(board_address, buff);
        basic.pause(100);
        buff[0] = 0x11;
        buff[1] = 160;
        pins.i2cWriteBuffer(board_address, buff);
    }
    //% weight=97
    //% block="set motor %motor speed to %speed"
    //% speed.min=-100 speed.max=100
    //% block.loc.cs="nastavit rychlost motoru $motor na $speed"
    export function setMotorSpeed(motor: MotorList, speed: number): void {
        let buf = pins.createBuffer(4);
        switch (motor) {
            case MotorList.M1:
                buf[0] = 0x01;
                buf[1] = 0x01;
                if (speed < 0) {
                    buf[1] = 0x02;
                    speed = speed * -1
                }
                buf[2] = speed;
                buf[3] = 0;
                pins.i2cWriteBuffer(board_address, buf);
                break;
            case MotorList.M2:
                buf[0] = 0x02;
                buf[1] = 0x01;
                if (speed < 0) {
                    buf[1] = 0x02;
                    speed = speed * -1
                }
                buf[2] = speed;
                buf[3] = 0;
                pins.i2cWriteBuffer(board_address, buf);
                break;
            default:
                break;
        }
    }
    //% weight=96
    //% block="set motor M1 speed %m1speed M2 speed %m2speed"
    //% m1speed.min=-100 m1speed.max=100
    //% m2speed.min=-100 m2speed.max=100
    //% block.loc.cs="nastavit rychlost motoru M1 na $m1speed a motoru M2 na $m2speed"
    export function setAllMotor(m1speed: number, m2speed: number): void {
        setMotorSpeed(MotorList.M1, m1speed)
        setMotorSpeed(MotorList.M2, m2speed)
    }
    //% weight=95
    //% block="stop motor %motor"
    //% block.loc.cs="zastavit motor $motor"
    export function stopMotor(motor: MotorList): void {
        setMotorSpeed(motor, 0)
    }
    //% weight=94
    //% block="stop all motors"
    //% block.loc.cs="zastavit všechny motory"
    export function stopAllMotor(): void {
        setMotorSpeed(MotorList.M1, 0)
        setMotorSpeed(MotorList.M2, 0)
    }
    //% weight=93
    //% block="set %servoType servo %servo angle to %angle ˚"
    //% angle.min=0 angle.max=360
    //% block.loc.cs="nastavit $servoType servo $servo na $angle ˚"
    export function setServoAngle(servoType: ServoTypeList, servo: ServoList, angle: number): void {
        let buf = pins.createBuffer(4);
        if (servo == 0) {
            buf[0] = 0x03;
        }
        if (servo == 1) {
            buf[0] = 0x04;
        }
        if (servo == 2) {
            buf[0] = 0x05;
        }
        if (servo == 3) {
            buf[0] = 0x06;
        }
        if (servo == 4) {
            buf[0] = 0x07;
        }
        if (servo == 5) {
            buf[0] = 0x08;
        }
        if (servo == 6) {
            buf[0] = 0x09;
        }
        if (servo == 7) {
            buf[0] = 0x10;
        }

        switch (servoType) {
            case ServoTypeList._180:
                angle = Math.map(angle, 0, 90, 0, 180)
                break
            case ServoTypeList._270:
                angle = Math.map(angle, 0, 270, 0, 180)
                break
            case ServoTypeList._360:
                angle = Math.map(angle, 0, 360, 0, 180)
                break
        }

        buf[1] = angle;
        buf[2] = 0;
        buf[3] = 0;
        pins.i2cWriteBuffer(board_address, buf);
    }
    //% weight=92
    //% block="set continuous rotation servo %servo speed to %speed\\%"
    //% speed.min=-100 speed.max=100
    //% block.loc.cs="nastavit kontinuální servo $servo na rychlost $speed\\%"
    export function setServoSpeed(servo: ServoList, speed: number): void {
        speed = Math.map(speed, -100, 100, 0, 180)
        setServoAngle(ServoTypeList._180, servo, speed)
    }
}