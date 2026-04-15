import { eq } from "drizzle-orm";

import * as readline from "readline";
import crypto from "crypto";

import { db } from "./db";
import { uf, cidade, regiao } from "./schema";



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});



function menu() {
  console.log("\n=== MENU ===\n");
  console.log("1 - Criar UF");
  console.log("2 - Listar UF");
  console.log("3 - Deletar UF");
  console.log("4 - Editar UF");
  console.log("5 - Criar Cidade");
  console.log("6 - Listar Cidades");
  console.log("7 - Criar Região");
  console.log("8 - Listar Regiões");
  console.log("0 - Sair");

  rl.question("\nEscolha uma opção: ", (opcao) => {
    switch (opcao) {

      // ================= UF =================

      case "1":
        rl.question("Nome da UF: ", (nome) => {
          rl.question("Sigla da UF: ", async (sigla) => {
            await db.insert(uf).values({
              id: crypto.randomUUID(),
              nome,
              sigla,
            });





            console.log("UF salva no banco!");
            menu();
          });
        });
        return;





      case "2":
        (async () => {
          const ufsBanco = await db.select().from(uf);

          console.log("\nLista de UFs:\n");
          ufsBanco.forEach((u, index) => {
            console.log(`${index + 1} - ${u.nome} (${u.sigla})`);
          });


          menu();
        })();
        return;





      case "3":
        rl.question("ID da UF para deletar: ", async (id) => {
          await db.delete(uf).where(eq(uf.id, id));
          console.log("UF deletada!");
          menu();
        });
        return;





      case "4":
        rl.question("ID da UF para editar: ", (id) => {
          rl.question("Novo nome: ", (nome) => {
            rl.question("Nova sigla: ", async (sigla) => {
              await db.update(uf)
              .set({ nome, sigla })
               .where(eq(uf.id, id));

              console.log("UF atualizada!");
              menu();
            });
          });
        });
        return;





      // ================= CIDADE =================

      case "5":
        rl.question("Nome da cidade: ", (nome) => {
          rl.question("UF ID: ", async (uf_id) => {
            await db.insert(cidade).values({
              id: crypto.randomUUID(),
              nome,
              uf_id,
            });

            console.log("Cidade salva no banco!");
            menu();
          });
        });
        return;





      case "6":
        (async () => {
          const cidadesBanco = await db.select().from(cidade);

          console.log("\nLista de Cidades:\n");
          cidadesBanco.forEach((c, index) => {
            console.log(`${index + 1} - ${c.nome} (${c.uf_id})`);
          });

          menu();
        })();
        return;






      // ================= REGIÃO =================

      case "7":
        rl.question("Nome da região: ", (nome) => {
          rl.question("Cidade ID: ", async (cidade_id) => {
            await db.insert(regiao).values({
              id: crypto.randomUUID(),
              nome,
              cidade_id,
            });

            console.log("Região salva!");
            menu();
          });
        });
        return;





      case "8":
        (async () => {
          const regioesBanco = await db.select().from(regiao);

          console.log("\nLista de Regiões:\n");
          regioesBanco.forEach((r, index) => {
            console.log(`${index + 1} - ${r.nome} (${r.cidade_id})`);
          });

          menu();
        })();
        return;





      // ================= SAIR =================

      case "0":
        console.log("Saindo...");
        rl.close();
        return;





      default:
        console.log("Opção inválida");
        menu();
    }
  });
}

menu();