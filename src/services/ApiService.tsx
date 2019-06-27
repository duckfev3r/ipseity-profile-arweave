import Arweave from "arweave/web";
import {
  IProfileDTO,
  IProfileMeta
} from "../components/containers/CreateProfile";
import * as lzstring from "lz-string";

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https"
});

const envDevPrefix = "ipseity-alpha-dev-01";
const envProdPrefix = "ipseity-alpha-00";

const prefix = envDevPrefix;

export default class ApiService {
  public async postProfile(
    profile: IProfileDTO,
    wallet: any,
    awv: any = arweave
  ) {
    let tx = await awv.createTransaction(
      {
        data: encodeURI(JSON.stringify(profile.data))
      },
      wallet
    );
    this.addAppMetaTags(tx, profile);
    try {
      await awv.transactions.sign(tx, wallet);
      const post = await awv.transactions.post(tx);
      if (post && post.status !== 200) {
        throw post.status;
      }
    } catch (err) {
      console.log("error");
      throw { err };
    }
  }

  private addAppMetaTags(tx: any, profile: IProfileDTO) {
    const meta = profile.meta as any;
    tx.addTag("App-Name", `${prefix}`);
    tx.addTag(`${prefix}-id`, this.randomString());
    tx.addTag("App-Version", "0.0.0");
    tx.addTag("Unix-Time", this.getTime());
    Object.keys(profile.meta).forEach((key: any) => {
      tx.addTag(`${prefix}-${key}`, encodeURI(meta[key]))
    });
    return tx;
  }

  decompressImages(files: string[]) {
    return files.map(img => {
      return lzstring.decompress(img);
    });
  }

  async getLatestProfileList(awv: any = arweave) {
    try {
      const queryResult = await this.queryProfiles(awv);
      // console
      // const filteredInvalidData = this.filterData(queryResult);
      // const filteredOldData = this.filterOldProfiles(filteredInvalidData);
      return this.createRows(queryResult);
    } catch (err) {
      throw { err };
    }
  }

  // Filter out Data whose rules violate our parameters.
  filterData(data: any) {}

  filterOldProfiles(data: any) {}

  public async queryProfiles(awv: any = arweave) {
    let query = {
      op: "equals",
      expr1: "App-Name",
      expr2: `${prefix}`
    };
    try {
      const res = await awv.api.post(`arql`, query);
      console.log("get all profiles res", res);
      return res;
    } catch (err) {
      return { err };
    }
  }

  public async getProfileData(id: string, awv: any = arweave) {
    try {
      const tx = await awv.transactions.get(id);
      const data = JSON.parse(
        decodeURI(tx.get("data", { decode: true, string: true }))
      );
      console.log("get profile data", data);
      return data;
    } catch (err) {
      return { err };
    }
  }

  private async createRows(
    res: any,
    getData: boolean = false,
    awv: any = arweave
  ) {
    let tx_rows: any[] = [];
    if (res.data == "") {
      tx_rows = [];
    } else {
      tx_rows = await Promise.all(
        res.data.map(async (id: string) => {
          let tx_row: any = {};
          let tx = await awv.transactions.get(id);
          tx_row["unixTime"] = "0";
          const tags = tx.get("tags");
          if (tags.length) {
            tx_row.tags = [];
            tx_row.ipseity_data = [];
            tx_row.ipseity_tags = [];
            tags.forEach((tag: any) => {
              let key: string = tag.get("name", { decode: true, string: true });
              let value: string = tag.get("value", {
                decode: true,
                string: true
              });
              if (
                key === `${prefix}-pseudonym` ||
                key === `${prefix}-title` ||
                key === `${prefix}-about` ||
                key === `${prefix}-location` ||
                key === `${prefix}-thumbnailImg`
              ) {
                value = decodeURI(value);
                tx_row.ipseity_data.push({ key, value });
                return;
              } else if (key.indexOf(prefix) > -1) {
                tx_row.ipseity_tags.push({ key, value });
              } else {
                tx_row[key] = { key, value };
              }
              if (key === "Unix-Time") tx_row["unixTime"] = value;
            });
          }

          tx_row["id"] = id;
          tx_row["tx_status"] = await awv.transactions.getStatus(id);
          tx_row["from"] = await awv.wallets.ownerToAddress(tx.owner);
          tx_row["td_fee"] = awv.ar.winstonToAr(tx.reward);
          tx_row["td_qty"] = awv.ar.winstonToAr(tx.quantity);

          if (getData) {
            tx_row["data"] = await tx.get("data", {
              decode: true,
              string: true
            });
          }

          return tx_row;
        })
      );
    }
    return tx_rows;
  }

  public checkStatus(awv: any = arweave) {
    awv.network.getInfo().then(console.log);
  }

  private getTime(): number {
    return Math.round(new Date().getTime() / 1000);
  }

  private randomString() {
    const chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (var i = 32; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
}

export { prefix };
