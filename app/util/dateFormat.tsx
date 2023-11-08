import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";

export const dateFormat = (date: Timestamp | string) => {
  // もしdateがstring型であれば、toDateメソッドを呼び出してTimestamp型に変換する。(0, 0)はFirestoreのTimestampを作成する際に必要なsecondsとnanosecondsの2つの引数。
  const timestamp = typeof date === "string" ? new Timestamp(0, 0) : date;
  // .toDate() はfirestore のメソッドでタイムスタンプをJSのDate型にしてる
  const formattedDate = format(timestamp.toDate(), "yyyy-MM-dd HH:mm");
  return formattedDate;
};
