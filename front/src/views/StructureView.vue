<script setup lang="ts"></script>

<template>
  <div class="services">
    <div class="title">
      <h1>Mes prestations dans une structure</h1>
    </div>
    <div class="photos">
      <div class="carre">
        <div class="imgsupport">
          <div class="txt">Réflexologies</div>
          <img src="../assets/chambre.png" alt="" />
          <div class="prix">
            <ul>
              <li>
                <div class="taille">Réflexologie relaxante</div>
                <div class="taillePrix">30€ / 30 min</div>
              </li>
              <li>
                <div class="taille">Réflexologie plantaire relaxante + PSIO</div>
                <div class="taillePrix">40€ / 30 min</div>
              </li>
              <li>
                <div class="taille">Réflexologie</div>
                <div class="taillePrix">50€</div>
              </li>
              <li>
                <div class="taille">Réflexologie + PSIO</div>
                <div class="taillePrix">60€</div>
              </li>
            </ul>
          </div>
        </div>

      </div>
      <div class="carre">
        <div class="imgsupport">
        <div class="txt">Massages</div>
          <img src="../assets/pied.png" alt="" />
          <div class="prix">
            <ul>
              <li>
                <div class="taille">Massage du dos</div>
                <div class="taillePrix">15€ / 15 min</div>
              </li>
              <li>
                <div class="taille">Massage du dos</div>
                <div class="taillePrix">30€ / 30 min</div>
              </li>
              <li>
                <div class="taille">Polarité</div>
                <div class="taillePrix">60€</div>
              </li>
              <li>
                <div class="taille">Californien</div>
                <div class="taillePrix">60€</div>
              </li>
              <li>
                <div class="taille">Massage de dos en entreprise</div>
                <div class="taillePrix">demandez un devis</div>
              </li>
              <li>
                <div class="taille">Massage atelier DO IN en entreprise</div>
                <div class="taillePrix">demandez un devis</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="carre">
        <div class="imgsupport">
          <div class="txt">Ateliers</div>
          <img src="../assets/cranien.jpg" alt="" />
          <div class="prix">
            <ul>
              <li>
                <div class="taille">Atelier parents/bébé - 5 Ateliers</div>
                <div class="taillePrix">160€ / 1h</div>
              </li>
              <li>
                <div class="taille">Atelier solo parents - 4 Ateliers</div>
                <div class="taillePrix">140€ / 1h</div>
              </li>
              <li>
                <div class="taille">Atelier parents/bébé en groupe - 5 Ateliers</div>
                <div class="taillePrix">110€ / 1h</div>
              </li>
              <li>
                <div class="taille">Californien</div>
                <div class="taillePrix">65 €</div>
              </li>
            </ul>
          </div>
        </div>
       
      </div>
    </div>

    <div class="trait"></div>
  </div>
</template>

<style scoped>
.services {
  position: relative;
  background-color: transparent;
  width: 100%;
}

.services .photos {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: distribute;
  justify-content: space-around;
}

.services .photos .carre {
  width: 30%;
  background-color: #e5e0ff;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.services .photos .carre .imgsupport {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  cursor: pointer;
}

.services .photos .carre img {
  height: 100%;
  width: 100%;
  opacity: .7;
}

.services .photos .carre .imgsupport .prix {
  background-color: #e5e0ff;
  height: 100%;
  width: 100%;
  position: absolute;
  bottom: -100%;
  -webkit-transition: .5s;
  transition: .5s;
  font-family: 'Montserrat';
  font-size: 20px;
  z-index: 2;
}

.services .photos .carre .imgsupport:hover .prix {
  bottom: 0;
}

.services .photos .carre .imgsupport .txt:hover + .prix {
  bottom: 0;
}

.services .photos .carre .imgsupport .prix ul {
  display: flex;
  flex-direction: column;
  padding: 0 8px;
}

.services .photos .carre .imgsupport .prix li {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.services .photos .carre .imgsupport .prix li .taille {
  display: flex;
  justify-content: flex-end;
  font-style: italic;
  font-weight: 600;
  width: 60%;
  text-align: right;
}

.services .photos .carre .imgsupport .prix li .taillePrix {
  font-weight: 900;
  width: 35%;
}

.services .photos .carre .imgsupport .prix .prixTitle {
  margin-bottom: 11px;
}

.services .photos .carre .txt {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: "Dancing Script";
  color: white;
  z-index: 1;
  user-select: none;
}

.services .title {
  height: 25vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5vh;
  padding-bottom: 5vh;
}

.services .title h1 {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  color: #000;
  margin-bottom: 40px;
  margin-top: 40px;
  padding: 10px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.8);
}

</style>
