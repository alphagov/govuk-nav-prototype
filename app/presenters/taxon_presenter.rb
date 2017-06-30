class TaxonPresenter
  GRID = :grid
  ACCORDION = :accordion
  LEAF = :leaf
  SUBLIST = :sublist

  attr_reader :taxon
  delegate(
    :content_id,
    :title,
    :description,
    :base_path,
    :tagged_content,
    :children?,
    :grandchildren?,
    :child_taxons,
    :most_popular_content,
    :can_subscribe?,
    to: :taxon
  )

  def initialize(taxon)
    @taxon = taxon
  end

  def rendering_type
    return GRID if taxon.great_grandchildren?
    return ACCORDION if taxon.grandchildren?
    return LEAF if taxon.children?
    SUBLIST
  end

  def renders_as_grid?
    rendering_type == GRID
  end

  def renders_as_accordion?
    rendering_type == ACCORDION
  end

  def renders_as_leaf?
    rendering_type == LEAF
  end

  def renders_as_sublist?
    rendering_type == SUBLIST
  end

  def accordion_content
    raise StandardError.new('Rendering type is not Accordion') unless renders_as_accordion?
    accordion_items = taxon.child_taxons.map { |taxon| TaxonPresenter.new(taxon) }

    general_information_title = 'General information and guidance'

    if tagged_content.count > 0
      general_information = Taxon.new(
        ContentItem.new(
          'content_id' => taxon.content_id,
          'title' => general_information_title,
          'base_path' => general_information_title.downcase.tr(' ', '-'),
          'description' => ''
        )
      )
      general_information.can_subscribe = false

      accordion_items.unshift(
        TaxonPresenter.new(general_information)
      )
    end

    accordion_items
  end
end
