import Head from "next/head";
import Image from "next/image";
import { useCallback, useState } from "react";
import styles from "../styles/Home.module.css";
import jsPDF from "jspdf";
import React from "react";

export default function Home() {
  const [currentData, setCurrentData] = useState([]);
  const [keyValue, setKeyValue] = useState<string>();

  const _generateCertificados = useCallback(() => {
    if (currentData.length !== 0) {
      currentData.map((item: any, i) => {
        let doc = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [600, 400],
        });

        let img = document.createElement("img");
        img.src = "/background.png";
        console.log(img);

        doc.addImage({
          imageData: img,
          x: 0,
          y: 0,
          width: 600,
          height: 400,
        });
        doc.setFont("helvetica");
        doc.setFontSize(20);
        // @ts-ignore
        doc.text(20, 20, `certifico que: ${item[keyValue as string]}`);
        doc.save(`certificado-${item[keyValue as string]}.pdf`);
      });
    }
  }, [currentData, keyValue]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Certificado generator</title>
        <meta
          name="Sistema que gera certificados a partir de um CSV"
          content="Certificados rápidos"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Certificado Generator!</h1>

        <p className={styles.description}>
          Gerando certificados rápidos via CSV
        </p>

        <div className={styles.content}>
          <div className={styles.containerItem}>
            <input
              type="file"
              accept="text/csv"
              onChange={(e: any) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (e: any) => {
                  const data = e.target.result;
                  const lines = data.split("\n");
                  lines.forEach((line: string, index: string | number) => {
                    lines[index] = line.replace(/\r/g, "");
                  });
                  const headers = lines[0].split(",");
                  const rows = lines.slice(1);
                  const dataObject = rows.reduce((acc: any, row: any) => {
                    const values = row.split(",");
                    const obj = {};
                    headers.forEach(
                      (header: string, index: string | number) => {
                        // @ts-ignore
                        obj[header] = values[index];
                      }
                    );
                    acc.push(obj);
                    return acc;
                  }, []);
                  setCurrentData(dataObject);
                };
                reader.readAsText(file);
              }}
            />
          </div>
          <div className={styles.containerItem}>
            Sua listagem aparecerá aqui!
            <ul className={styles.listData}>
              {currentData.map((item, i) => (
                <li key={i} className={styles.itemListData}>
                  {Object.entries(item).map(([key, value], j) => {
                    return (
                      <div key={j}>
                        <div>
                          <b>{key}</b>: {value}
                        </div>
                      </div>
                    );
                  })}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.containerItem}>
            {currentData.length > 0 && (
              <>
                chave de referencia do dado
                <input
                  style={{ marginBottom: 32 }}
                  type="text"
                  value={keyValue}
                  onChange={(e) => {
                    setKeyValue(e.target.value);
                  }}
                />
                {keyValue && (
                  <button onClick={_generateCertificados}>
                    gerar certificados!
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://weverton.me" target="_blank" rel="noopener noreferrer">
          Powered by Weverton
        </a>
      </footer>
    </div>
  );
}
