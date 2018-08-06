export interface IDepresser {
  depress(rawImg: any): Uint8Array[];
}
export class RAWDepresser implements IDepresser {
  depress(rawImg: any): Uint8Array[] {
    const channelNum = rawImg.channels();
    const rtn = [];
    for (let i = 0; i < channelNum; i++) {
      const chanData = new Uint8Array(rawImg.channelLength);
      for (let j = 0; j < rawImg.channelLength; j++) {
        chanData[j] = rawImg.file.data[rawImg.file.pos++];
      }
      rtn.push(chanData);
    }
    return rtn;
  }
}

export class RLEDepresser implements IDepresser {
  byteCountes: number[] = [];
  depress(rawImg: any): Uint8Array[] {
    const channelLength = rawImg.channels();
    const height = rawImg.height();
    const rtn = [];
    this.parseByteCounts(rawImg.file, height, channelLength);
    for (let i = 0; i < channelLength; i++) {
      rtn.push(this.parseChannelData(rawImg, i));
    }
    return rtn;

  }

  parseByteCounts(file: any, height: number, channelLength: number) {
    const totalRows = height * channelLength;
    this.byteCountes = [];
    for (let i = 0; i < totalRows; i++) {
      this.byteCountes[i] = file.readShort();
    }
  }
  parseChannelData(rawImg: any, chanIdx: number): Uint8Array {
    const height = rawImg.height();
    const offset = chanIdx * height;
    const file = rawImg.file;
    const buffer = new Uint8Array(rawImg.channelLength);
    let pos = 0;
    for (let i = 0; i < height; i++) {
      const byteCount = this.byteCountes[offset + i];
      const finish = file.tell() + byteCount;
      while (file.tell() < finish) {
        let len = file.data[file.pos++];
        if (len < 128) {
          len += 1;
          for (let j = 0; j < len; j++) {
            buffer[pos++] = file.data[file.pos++];
          }
        } else if (len > 128) {
          len ^= 0xff;
          len += 2;
          const val = file.data[file.pos++];
          for (let j = 0; j < len; j++) {
            buffer[pos++] = val;
          }
        }
      }
    }
    return buffer;
  }
}
export class RLELayerDepresser extends RLEDepresser {
  depress(rawImg: any): Uint8Array[] {
    const channelLength = 1;
    const height = rawImg.height();
    const rtn = [];
    this.parseByteCounts(rawImg.file, height, channelLength);
    for (let i = 0; i < channelLength; i++) {
      rtn.push(this.parseChannelData(rawImg, i));
    }
    return rtn;

  }

  parseByteCounts(file: any, height: number, channelLength: number) {
    const totalRows = height * channelLength;
    this.byteCountes = [];
    for (let i = 0; i < totalRows; i++) {
      this.byteCountes[i] = file.readShort();
    }
  }
}
export class RAWLayerDepresser extends RAWDepresser {
  depress(rawImg: any): Uint8Array[] {
    const rtn = [];
    rawImg.chanPos = 0;
    rawImg.channelData = new Uint8Array(rawImg.chan.length - 2);
    // rawImg.channelData=[];
    rawImg.parseRaw();
    rtn.push(rawImg.channelData);
    rawImg.chanPos = 0;
    rawImg.channelData = null;
    // const channelNum = 1;
    // const rtn = []
    // for (let i = 0; i < channelNum; i++) {
    //   const chanData = new Uint8Array(rawImg.channelLength);
    //   for (let j = 0; j < rawImg.channelLength; j++) {
    //     chanData[j] = rawImg.file.data[rawImg.file.pos++];
    //   }
    //   rtn.push(chanData);
    // }
    return rtn;
  }
}
