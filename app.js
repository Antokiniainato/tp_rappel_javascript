
var dataJSON = []

window.addEventListener('load', async () => {
  // Définir le nom du fichier JSON et la clé de stockage local
  const nomFichier = 'data.json';
  const cleDeStockage = 'data';

  // Fonction pour importer les données et appeler la fonction de rappel
  async function importerdata(nomFichier, cleDeStockage, callback) {
    try {
      // Récupérer les données JSON du fichier
      const reponse = await fetch(nomFichier);

      // Vérifier si la requête a réussi
      if (!reponse.ok) {
        throw new Error(`Erreur de chargement du fichier JSON : ${reponse.status}`);
      }

      // Convertir la réponse en objet JavaScript
      const data = await reponse.json();

      // Filtrer et stocker les données si elles ne sont pas déjà présentes
      if (!localStorage.getItem(cleDeStockage)) {
        const dataFiltrees = data.map(data => ({
          id: data.id,
          name: data.name,
          email: data.email,
          devise: data.devise
        }));

        localStorage.setItem(cleDeStockage, JSON.stringify(dataFiltrees));
        
        console.log('Données JSON importées avec succès dans le localStorage'); 
      }

      // Appeler la fonction de rappel avec les données récupérées
      callback(JSON.parse(localStorage.getItem(cleDeStockage)));
    } catch (error) {
      console.error('Une erreur est survenue :', error);
    }
  }

  // Logique d'importation de données et de mise à jour du tableau
  try {
    // Définir une fonction de rappel pour gérer la disponibilité des données
    const fonctionRappeldataPretes = (data) => {
      // Appeler la fonction rechargerTable avec les données récupérées
      getMaxID(data)
      dataJSON = JSON.parse(localStorage.getItem("data"))
      rechargerTable(data);
    };

    // Importer les données et appeler la fonction de rappel
    await importerdata(nomFichier, cleDeStockage, fonctionRappeldataPretes);
  } catch (error) {
    console.error('Une erreur est survenue :', error);
  }
});



function getMaxID(dataJSON){
  // Mettre à jour l'identifiant le plus élevé si nécessaire
  let maxID = localStorage.getItem('maxID') ? parseInt(localStorage.getItem('maxID')) : 0;
  for (const data of dataJSON) {
    if (data.id > maxID) {
      maxID = data.id;
    }
  }
  localStorage.setItem('maxID', maxID);
  console.log('Identifiant le plus élevé mis à jour');
}

function rechargerTable(dataJSON){
  let tableauHTML = '<table class="table table-bordered align-middle nowrap">'

  // En-tête du tableau
  tableauHTML += `
    <thead>
      <tr>
          <th scope="col">ID</th>
          <th scope="col">Nom</th>
          <th scope="col">Email</th>
          <th scope="col">Devise</th>
          <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody> 
  `
  
  // Lignes du tableau
  for (const data of dataJSON) {
    tableauHTML += `
        <tr>
        <th scope="row">${data.id}</th>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.devise}</td>
        <td>
            <ul class="list-unstyled hstack gap-1 mb-0">
                <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Editer" data-bs-original-title="Editer">
                    <a data-bs-toggle="modal" data-bs-target="#edit${data.id}" class="btn btn-sm btn-soft-primary"><i class="mdi mdi-square-edit-outline"></i></a>
                    <div class="modal fade" id="edit${data.id}" tabindex="-1" aria-labelledby="ajouterclientModalLabel" style="display: none;" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="ajouterclientModalLabel">Modifier un donnée dans ${data.name}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form method="post" onsubmit="modifierData(event, ${data.id})">
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <input type="hidden" class="form-control" id="orderid-input" value="">
                                                <div class="mb-3">
                                                    <label for="nom_edit" class="form-label">Nom :</label>
                                                    <input value="${data.name}" type="text" name="nom_edit" id="nom_edit${data.id}" class="form-control" placeholder="Entrer le nom" required="">
                                                    <div class="invalid-feedback">Veuillez saisir le nom.</div>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="email_edit" class="form-label">Email :</label>
                                                    <input value="${data.email}" type="email" name="email_edit" id="email_edit${data.id}" class="form-control" placeholder="Entrer le émail" required="">
                                                    <div class="invalid-feedback">Veuillez saisir l'émail.</div>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="devise_edit" class="form-label">Devise :</label>
                                                    <select name="devise" id="devise_edit${data.id}" class="form-control" required>
                                                      <option value="" selected>Sélectionner une devise</option>
                                                      <option value="MGA" ${data.devise === 'MGA' ? 'selected' : ''}>Ariary malgache</option>
                                                      <option value="USD" ${data.devise === 'USD' ? 'selected' : ''}>Dollar américain</option>
                                                      <option value="EUR" ${data.devise === 'EUR' ? 'selected' : ''}>Euro</option>
                                                      <option value="GBP" ${data.devise === 'GBP' ? 'selected' : ''}>Livre sterling</option>
                                                      <option value="JPY" ${data.devise === 'JPY' ? 'selected' : ''}>Yen japonais</option>
                                                    </select>
                                                    <div class="invalid-feedback">Veuillez sélectionner une devise.</div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div class="text-end">
                                                    <button type="reset" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
                                                    <button type="submit" name="submit" class="btn btn-success" data-bs-dismiss="modal">Enregistrer</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Supprimer" data-bs-original-title="Supprimer">
                    <a data-bs-toggle="modal" data-bs-target="#remove${data.id}" class="btn btn-sm btn-soft-danger"><i class="mdi mdi-delete-outline"></i></a>
                    <div class="modal fade" id="remove${data.id}" tabindex="-1" aria-labelledby="ajouterclientModalLabel" style="display: none;" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-sm">
                            <div class="modal-content">
                                <div class="modal-body px-4 py-5 text-center">
                                    <button type="button" class="btn-close position-absolute end-0 top-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
                                    <div class="avatar-sm mb-4 mx-auto">
                                        <div class="avatar-title bg-primary text-primary bg-opacity-10 font-size-20 rounded-3">
                                            <i class="mdi mdi-trash-can-outline"></i>
                                        </div>
                                    </div>
                                    <p class="text-muted font-size-16 mb-4">Êtes-vous sûr de vouloir supprimer ${data.name} ?</p>
                                    
                                    <div class="hstack gap-2 justify-content-center mb-0">
                                        <button type="button" class="btn btn-secondary" id="close-removeProductModal" data-bs-dismiss="modal">Fermer</button>
                                        <a type="button" class="btn btn-danger" id="remove-item" data-bs-dismiss="modal" onclick='supprimerData(${data.id})'>Supprimer</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </td>
      </tr>
    `;
  }
  
  // Fermeture du tableau
  tableauHTML += `
      </tbody>
    </table>
  `
  document.getElementById('tableau').innerHTML = tableauHTML;
}

function ajouterData(event) {
  event.preventDefault();
  let modal = document.getElementById("add")

  // Récupérer l'identifiant le plus élevé existant (ou initialiser à 0)
  let maxID = localStorage.getItem("maxID") ? parseInt(localStorage.getItem("maxID")) : 0;

  // Incrémenter l'identifiant pour la nouvelle donnée
  maxID++;

  // Créer l'objet de données avec l'identifiant incrémenté
  const newdata = {
    id: maxID,
    name: document.getElementById("nom").value,
    email: document.getElementById("email").value,
    devise: document.getElementById("devise").value
  };

  // Ajouter l'objet newdata directement au tableau dataJSON
  dataJSON.push(newdata)
  
  // Stocker les données avec l'identifiant dans le stockage local
  localStorage.setItem("maxID", maxID);
  localStorage.setItem("data", JSON.stringify(dataJSON));

  // Appeler la fonction rechargerTable (en supposant qu'elle met à jour le tableau)
  rechargerTable(dataJSON);
}

function supprimerData(id) {
  const index = dataJSON.findIndex(element => element.id === id);

  if (index !== -1) {
    // Supprimer l'élément du tableau
    dataJSON.splice(index, 1);

    // Mettre à jour le stockage local avec les données modifiées
    localStorage.setItem("data", JSON.stringify(dataJSON));

    rechargerTable(dataJSON);
  } else {
    console.error(`Élément avec l'ID ${id} introuvable dans le stockage local`);
  }
}

function modifierData(event, id) {
  event.preventDefault();

  // Trouver l'index de l'élément à modifier
  const index = dataJSON.findIndex(data => data.id === id);

  // Créer l'objet de données avec l'identifiant incrémenté
  const newdata = {
    name: document.getElementById("nom_edit" + id).value,
    email: document.getElementById("email_edit" + id).value,
    devise: document.getElementById("devise_edit" + id).value
  };

  // Vérifier si l'élément existe
  if (index !== -1) {
    // Mettre à jour les propriétés de l'élément avec les nouvelles valeurs
    dataJSON[index] = { ...dataJSON[index], ...newdata };

    // Mettre à jour le stockage local avec les données modifiées
    localStorage.setItem("data", JSON.stringify(dataJSON));

    rechargerTable(dataJSON);
  } else {
    console.error(`Élément avec l'ID ${id} introuvable dans le stockage local`);
  }
}

function rechercherData(mot_cle) {
  // Convertir le terme de recherche en minuscules
  const nom_rechercher = mot_cle.toLowerCase();

  // Filtrer les données en fonction du terme de recherche
  const donneesFiltrees = dataJSON.filter(data => {
    return data.name.toLowerCase().includes(nom_rechercher);
  });

  rechargerTable(donneesFiltrees); 
}

