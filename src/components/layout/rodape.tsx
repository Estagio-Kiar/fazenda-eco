import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { MarcaFazenda } from './logo'

export function Rodape() {
  return (
    <footer id="contacto" className="mt-20 scroll-mt-28 border-t border-menta bg-nevoa">
      <div className="container-loja grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-floresta">
            <MarcaFazenda className="size-8" />
            Fazenda
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Do campo para a sua mesa. Produtos frescos colhidos na fazenda e entregues em Luanda.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Loja</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-floresta" to="/loja">
                Todos os produtos
              </Link>
            </li>
            <li>
              <Link className="hover:text-floresta" to="/cabazes">
                Cabazes da semana
              </Link>
            </li>
            <li>
              <Link className="hover:text-floresta" to="/loja?promocao=1">
                Promoções
              </Link>
            </li>
            <li>
              <Link className="hover:text-floresta" to="/favoritos">
                Favoritos
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Ajuda</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-floresta" to="/carrinho">
                O meu carrinho
              </Link>
            </li>
            <li>
              <Link className="hover:text-floresta" to="/conta">
                A minha conta
              </Link>
            </li>
            <li>
              <Link className="hover:text-floresta" to="/#como-funciona">
                Como funciona a entrega
              </Link>
            </li>
          </ul>
        </div>
        <div>
          {/* Contactos provisórios: confirmar com a Fazenda no levantamento (fase 1). */}
          <h2 className="mb-3 text-sm font-semibold">Contacto</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> Luanda, Angola
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> +244 900 000 000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" /> loja@fazenda.ao
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-menta">
        <p className="container-loja py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Fazenda. As imagens e os modelos 3D são ilustrativos.
          Desenvolvido por KIAR Group.
        </p>
      </div>
    </footer>
  )
}
