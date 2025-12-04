/* pagina de recursos - lista de funcionalidades do app */

export default function RecursosPage() {
  return (
    <>
      <section className="section-recursos">
        <div className="container">
          <h2 className="section-title">Recursos</h2>
          <div className="section-subtitle">
            <h1>
                Organize seu networking.
            </h1> 
            <h1>
                Otimize seu tempo.
            </h1> 
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <h3>Agenda Unificada</h3>
              <p>
                Todos os seus contatos, de todas as plataformas, em um só lugar.
              </p>
            </div>

            <div className="feature-card">
              <h3>Lembretes de Conexão</h3>
              <p>
                Agende lembretes para ligar, mandar mensagem ou e-mail para
                pessoas importantes.
              </p>
            </div>

            <div className="feature-card">
              <h3>Busca Inteligente</h3>
              <p>
                Encontre qualquer contato em segundos: por nome, empresa ou
                última interação.
              </p>
            </div>

            <div className="feature-card">
              <h3>Insights de Relacionamento</h3>
              <p>
                Veja quem você está deixando esfriar e receba sugestões de com
                quem se reconectar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
